import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, message } = await req.json();
    if (!conversationId || !message) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // 1. Verify ownership of the conversation thread
    const conv = await prisma.aiConversation.findUnique({
      where: { id: conversationId },
    });
    if (!conv || conv.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const batchId = conv.batchId;

    // Parse JSON message payload (Option A)
    let queryText = message;
    let attachments: any[] = [];
    let attachedImages: string[] = [];

    try {
      if (message.startsWith("{")) {
        const parsed = JSON.parse(message);
        queryText = parsed.text || message;
        attachments = parsed.attachments || [];
        attachedImages = parsed.images || (parsed.image ? [parsed.image] : []);
      }
    } catch (e) {}

    // 2. Fetch classroom context for the Gemini instruction prompt
    // A. Fetch Notes
    const notes = await prisma.note.findMany({
      where: { batchId },
      select: { title: true, subject: true, content: true },
    });
    const notesStr = notes
      .map((n) => `[Note Subject: ${n.subject}] Title: ${n.title}\nContent: ${n.content}`)
      .join("\n\n");

    // B. Fetch past Live Session Summaries (Minutes of Meeting)
    const sessions = await prisma.liveSession.findMany({
      where: { batchId },
      include: { meetingMinutes: true },
    });
    const summariesStr = sessions
      .map((s) => s.meetingMinutes?.content)
      .filter(Boolean)
      .join("\n\n");

    // C. Fetch user's own solved doubts in this batch
    const doubts = await prisma.doubt.findMany({
      where: {
        sessionId: { in: sessions.map((s) => s.roomId) },
        studentId: session.user.id,
      },
      select: { doubtText: true, answer: true },
    });
    const doubtsStr = doubts
      .map((d) => `Q: ${d.doubtText}\nA: ${d.answer}`)
      .join("\n\n");

    // D. Fetch past message history in this conversation thread
    const history = await prisma.aiMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    // Fetch details of specifically attached contexts
    let attachedContextStr = "";
    if (attachments.length > 0) {
      attachedContextStr = "\n\nDIRECT REFERENCES ATTACHED BY USER FOR THIS QUERY (Prioritize these documents):\n";
      for (const att of attachments) {
        if (att.type === "notes" || att.type === "note") {
          const noteObj = await prisma.note.findUnique({
            where: { id: att.id },
            select: { title: true, content: true, subject: true },
          });
          if (noteObj) {
            attachedContextStr += `[Attached Note: ${noteObj.title} (${noteObj.subject})]\n${noteObj.content}\n\n`;
          }
        } else if (att.type === "doubts" || att.type === "doubt") {
          const doubtObj = await prisma.doubt.findUnique({
            where: { id: att.id },
            select: { doubtText: true, answer: true },
          });
          if (doubtObj) {
            attachedContextStr += `[Attached Past Class Doubt]\nQuestion: ${doubtObj.doubtText}\nAnswer: ${doubtObj.answer}\n\n`;
          }
        } else if (att.type === "summaries" || att.type === "summary") {
          const minutesObj = await prisma.meetingMinutes.findUnique({
            where: { sessionId: att.id },
            select: { content: true },
          });
          if (minutesObj) {
            attachedContextStr += `[Attached Meeting Minutes Summary]\n${minutesObj.content}\n\n`;
          }
        }
      }
    }
    
    // Format message history for Gemini API contents parameter
    const contents = history.map((m) => {
      let contentText = m.content;
      try {
        if (m.role === "user" && m.content.startsWith("{")) {
          const parsed = JSON.parse(m.content);
          contentText = parsed.text || m.content;
        }
      } catch (e) {}

      return {
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: contentText }],
      };
    });
    
    // Append the user's latest query text
    contents.push({
      role: "user",
      parts: [{ text: queryText }],
    });

    // If there are images attached, convert and push to Gemini parts
    if (attachedImages && attachedImages.length > 0) {
      for (const attachedImage of attachedImages) {
        let mimeType = "";
        let base64Data = "";

        if (attachedImage.startsWith("data:")) {
          const matches = attachedImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64Data = matches[2];
          }
        } else if (attachedImage.startsWith("http://") || attachedImage.startsWith("https://")) {
          try {
            const imgRes = await fetch(attachedImage);
            if (imgRes.ok) {
              mimeType = imgRes.headers.get("content-type") || "image/jpeg";
              const arrayBuffer = await imgRes.arrayBuffer();
              base64Data = Buffer.from(arrayBuffer).toString("base64");
            } else {
              console.error("[AI Chat API] Failed to fetch attached image:", attachedImage, imgRes.statusText);
            }
          } catch (fetchErr) {
            console.error("[AI Chat API] Error fetching attached image:", fetchErr);
          }
        }

        if (mimeType && base64Data) {
          contents[contents.length - 1].parts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          } as any);
        }
      }
    }

    // 3. Construct Unified System Prompt
    const systemInstruction = `You are "OpenGrapes AI", a premium, helpful, and encouraging AI study companion and academic mentor for a student in this classroom batch.
Your role is to guide and teach concepts, explain topics, and clear doubts.

CLASSROOM CONTEXT:
Use the following classroom materials to personalize and ground your answers:
---
[CLASSROOM NOTES]
${notesStr || "No notes uploaded by the teacher yet."}
---
[LIVE SESSION MINUTES & SUMMARIES]
${summariesStr || "No live sessions summarized yet."}
---
[STUDENT'S PAST SOLVED DOUBTS]
${doubtsStr || "No past resolved doubts in this batch."}
---${attachedContextStr}

INSTRUCTIONS:
1. Ground your answers using the classroom context (notes, summaries, past doubts) whenever possible to remain consistent with what the teacher is teaching.
2. If direct user attachments are provided above, focus heavily on them when answering.
3. If the user asks something not directly present in the context, synthesize the answer using your general knowledge, but prioritize the classroom content.
4. Be encouraging, clear, and structured. Use **bold** for key terms and bullet points for lists.
5. Format math using standard LaTeX format (use $...$ for inline math and $$...$$ for block display equations).`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    // Call Gemini streaming API (using low-latency gemini-2.5-flash-lite)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("[AI Chat API] Gemini returned error:", errText);
      return NextResponse.json({ error: "Failed to connect to AI engine" }, { status: 502 });
    }

    // Return a Response Stream
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let buffer = "";
        let fullAnswer = "";

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (value) {
              buffer += decoder.decode(value, { stream: !done });
              const lines = buffer.split("\n");
              // Keep the last partial line in buffer
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  try {
                    const jsonStr = line.slice(6).trim();
                    if (jsonStr === "[DONE]") continue;
                    const parsed = JSON.parse(jsonStr);
                    const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (chunkText) {
                      fullAnswer += chunkText;
                      controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                  } catch (parseErr) {
                    // Ignore partial JSON parsing errors
                  }
                }
              }
            }
          }

          // Handle final buffer content if any
          if (buffer.startsWith("data: ")) {
            try {
              const jsonStr = buffer.slice(6).trim();
              const parsed = JSON.parse(jsonStr);
              const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (chunkText) {
                fullAnswer += chunkText;
                controller.enqueue(new TextEncoder().encode(chunkText));
              }
            } catch (e) {}
          }

          // 4. Stream finished. Save the user query and the full model answer to database
          // Check if user query was already saved (to avoid duplicates for the first message)
          const lastMsg = history[history.length - 1];
          const shouldSaveUserMsg = !lastMsg || lastMsg.content !== message;

          if (shouldSaveUserMsg) {
            await prisma.aiMessage.create({
              data: {
                conversationId,
                role: "user",
                content: message,
              },
            });
          }

          // Save the assistant's response
          await prisma.aiMessage.create({
            data: {
              conversationId,
              role: "model",
              content: fullAnswer,
            },
          });

          // Touch conversation's updatedAt to reflect active time
          await prisma.aiConversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
          });

        } catch (streamErr) {
          console.error("[AI Chat API] Stream reading error:", streamErr);
          controller.error(streamErr);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });

  } catch (err: any) {
    console.error("[AI Chat Route] Internal error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
