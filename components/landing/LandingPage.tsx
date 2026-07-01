"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";

const PAGE_CSS = `
/* === OpenGrapes landing page: reset layout overrides from root layout === */
body {
  background: var(--bg-page, #f7f3e9) !important;
  display: block !important;
  min-height: 0 !important;
  flex-direction: initial !important;
  align-items: initial !important;
  justify-content: initial !important;
}
/* OpenGrapes Design System â global entry point.
   Consumers link this one file. @import lines only. */
/* OpenGrapes â Webfonts
   Loaded from Google Fonts. These are the canonical brand faces (not substitutions):
   Spectral (display serif), Hanken Grotesk (body/UI), Spline Sans Mono (mono/labels). */
/* cyrillic-ext */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/d5209d86-c394-4d37-a2fe-8c285ca0b1d1.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* vietnamese */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/5f9ddca9-1139-4bf8-b1ad-373b511eab80.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/608a9e3b-13af-4e2d-860c-f33e202dcecd.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/7a01ca1e-8354-497c-92b7-5811b811d25f.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/d5209d86-c394-4d37-a2fe-8c285ca0b1d1.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* vietnamese */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/5f9ddca9-1139-4bf8-b1ad-373b511eab80.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/608a9e3b-13af-4e2d-860c-f33e202dcecd.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/7a01ca1e-8354-497c-92b7-5811b811d25f.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/d5209d86-c394-4d37-a2fe-8c285ca0b1d1.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* vietnamese */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/5f9ddca9-1139-4bf8-b1ad-373b511eab80.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/608a9e3b-13af-4e2d-860c-f33e202dcecd.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/7a01ca1e-8354-497c-92b7-5811b811d25f.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/og-landing/d5209d86-c394-4d37-a2fe-8c285ca0b1d1.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* vietnamese */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/og-landing/5f9ddca9-1139-4bf8-b1ad-373b511eab80.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/og-landing/608a9e3b-13af-4e2d-860c-f33e202dcecd.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/og-landing/7a01ca1e-8354-497c-92b7-5811b811d25f.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Spectral';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/f5ff679e-18ab-4a22-bdc1-168286db56cb.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Spectral';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/6dc2c540-ae00-4dc2-bff1-7720e788858a.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Spectral';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/b4aa8cb0-00a2-4d2e-9a2c-469b1920b26c.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Spectral';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/02c46655-90a1-44fa-9dd6-ad93eaa848c8.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Spectral';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/8bd35447-66e6-4224-b44e-5246aad63f54.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url("/og-landing/36eb91fe-052a-48b3-a4ef-30e9e20258fc.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url("/og-landing/25a9bdba-aa5f-4aca-82a1-410dc9af562c.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url("/og-landing/cb31ff57-bc82-4088-9ac5-00c2aaaa21f8.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url("/og-landing/bfac260c-55c0-4313-81f8-2d321d347349.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url("/og-landing/0c939a6b-ef53-4b6e-a48b-e5b9e6b17de9.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/31c0ecfd-bf73-4982-9b60-1336eb9dcb56.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/c69bb0b6-0bde-4082-94a2-a06e8d4fae94.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/17c02966-6233-44fe-8d1a-7deb2fd60e3d.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/e3958420-3adb-4655-97bb-acd8c155e4f4.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/488e5675-cb25-44a8-aa2c-a77f01d9c6c1.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/01d510c6-b90c-4de7-a0f9-d2bf7d802185.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/91f0b5e8-76fa-4cf1-8c1f-7fe146492795.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/ccee35a3-058e-4cec-974e-bf825e153be9.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/6a0081c9-7124-40af-9f3d-d2af37169a35.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/3675f4cd-2ba4-4983-ace2-3a123d957170.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/c8ad4475-60cf-4b12-9bac-451f515bf9e5.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/52ee011c-91a6-44c5-a45c-44adc18f5403.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/42a24580-c438-4518-9db5-b1835379d90f.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/9a30f806-5c31-4934-a6d6-07d485c9c037.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/9567f757-def3-426f-a2c4-8d987aadabb1.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin-ext */
@font-face {
  font-family: 'Spline Sans Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/5f4f7fe8-a2f5-42fb-be0f-b82b71651fba.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Spline Sans Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/og-landing/0acf7612-ce90-478f-b924-bb97ca0bc158.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin-ext */
@font-face {
  font-family: 'Spline Sans Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/5f4f7fe8-a2f5-42fb-be0f-b82b71651fba.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Spline Sans Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/og-landing/0acf7612-ce90-478f-b924-bb97ca0bc158.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}


/* OpenGrapes â Color tokens
   Mature, smooth palette: warm cream base, sage green + muted purple accents. */
:root {
  /* ââ Base / surfaces (warm off-white & cream) ââ */
  --cream-50:  #FBF9F3;   /* lightest paper */
  --cream-100: #F7F3E9;   /* page background */
  --cream-200: #F1ECDE;   /* sunken / alt section */
  --cream-300: #E8E1CF;   /* hairline on cream */

  /* ââ Ink (warm near-black, never pure #000) ââ */
  --ink-900: #23211C;     /* headings */
  --ink-700: #423F37;     /* body */
  --ink-500: #6B6557;     /* muted / captions */
  --ink-300: #9C9685;     /* faint */

  /* ââ Sage green (primary accent) ââ */
  --sage-50:  #EDF2EA;
  --sage-100: #DCE6D6;
  --sage-200: #BFD2B5;
  --sage-300: #9DBA8F;
  --sage-500: #6E9461;    /* core green */
  --sage-600: #587A4D;
  --sage-700: #44603C;

  /* ââ Muted purple (secondary accent) ââ */
  --plum-50:  #F0ECF4;
  --plum-100: #E3DBEC;
  --plum-200: #CBBCDC;
  --plum-300: #AD98C6;
  --plum-500: #836BA6;    /* core purple */
  --plum-600: #6B5489;
  --plum-700: #534168;

  /* ââ Semantic aliases ââ */
  --bg-page:        var(--cream-100);
  --bg-paper:       var(--cream-50);
  --bg-sunken:      var(--cream-200);
  --surface-card:   var(--cream-50);
  --border-hair:    var(--cream-300);
  --border-strong:  #DAD2BE;

  --text-heading:   var(--ink-900);
  --text-body:      var(--ink-700);
  --text-muted:     var(--ink-500);
  --text-faint:     var(--ink-300);

  --accent-green:   var(--sage-500);
  --accent-green-deep: var(--sage-700);
  --accent-purple:  var(--plum-500);
  --accent-purple-deep: var(--plum-700);

  --focus-ring:     var(--plum-300);

  /* ââ Status ââ */
  --status-paid:    var(--sage-600);
  --status-partial: #C18A3D;
  --status-unpaid:  #B6604E;
  --status-live:    #C0524A;
}

/* OpenGrapes â Typography tokens
   Display: Spectral (serif, editorial, mature). Body/UI: Hanken Grotesk. Mono: Spline Sans Mono. */
:root {
  --font-display: "Spectral", Georgia, "Times New Roman", serif;
  --font-body: "Hanken Grotesk", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "Spline Sans Mono", ui-monospace, "SF Mono", Menlo, monospace;

  /* Type scale (1.25 major-third-ish, tuned) */
  --text-xs:   0.78rem;   /* 12.5px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-md:   1.125rem;  /* 18px */
  --text-lg:   1.375rem;  /* 22px */
  --text-xl:   1.75rem;   /* 28px */
  --text-2xl:  2.25rem;   /* 36px */
  --text-3xl:  3rem;      /* 48px */
  --text-4xl:  4rem;      /* 64px */
  --text-5xl:  5.25rem;   /* 84px */

  --leading-tight: 1.08;
  --leading-snug: 1.25;
  --leading-normal: 1.55;
  --leading-relaxed: 1.7;

  --tracking-tight: -0.02em;
  --tracking-snug: -0.01em;
  --tracking-normal: 0;
  --tracking-wide: 0.08em;
  --tracking-caps: 0.14em;

  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
}

/* OpenGrapes â Spacing, radius, shadow tokens */
:root {
  /* Spacing scale (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
  --space-11: 160px;

  /* Radii â soft, mature, never pill-everything */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  /* Shadows â low, warm, diffuse. No harsh black. */
  --shadow-xs: 0 1px 2px rgba(60, 52, 32, 0.05);
  --shadow-sm: 0 2px 8px rgba(60, 52, 32, 0.06);
  --shadow-md: 0 8px 24px rgba(60, 52, 32, 0.08);
  --shadow-lg: 0 18px 48px rgba(60, 52, 32, 0.10);

  /* Layout */
  --container: 1180px;
  --container-narrow: 760px;

  /* Motion */
  --ease-out: cubic-bezier(0.22, 0.61, 0.36, 1); /* @kind other */
  --ease-soft: cubic-bezier(0.4, 0, 0.2, 1); /* @kind other */
  --dur-fast: 160ms; /* @kind other */
  --dur-base: 280ms; /* @kind other */
  --dur-slow: 600ms; /* @kind other */
}

/* OpenGrapes â Base reset & element defaults */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--text-body);
  background: var(--bg-page);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
h1, h2, h3, h4, h5 {
  font-family: var(--font-display);
  color: var(--text-heading);
  font-weight: var(--weight-regular);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  margin: 0;
}
p { margin: 0; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
::selection { background: var(--plum-100); color: var(--ink-900); }
:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }

.eyebrow {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--accent-purple);
  font-weight: var(--weight-medium);
}


/* cyrillic-ext */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/f3496593-b7fc-457b-9b65-7fb17a55a050.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/d48ee435-41a6-4558-bef6-ae1c8c5ab008.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* latin-ext */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/b2cf8e62-b473-40ff-b4b0-619eeda1a089.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/og-landing/925d5ff1-efb0-47c7-bbe2-80b459c062aa.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/og-landing/f3496593-b7fc-457b-9b65-7fb17a55a050.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/og-landing/d48ee435-41a6-4558-bef6-ae1c8c5ab008.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* latin-ext */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/og-landing/b2cf8e62-b473-40ff-b4b0-619eeda1a089.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/og-landing/925d5ff1-efb0-47c7-bbe2-80b459c062aa.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}


  /* ============ Landing page ============ */
  .wrap { max-width: var(--container); margin: 0 auto; padding: 0 28px; }
  body { overflow-x: hidden; }

  /* ---- Header ---- */
  header.site {
    position: sticky; top: 0; z-index: 50;
    background: color-mix(in srgb, var(--cream-100) 82%, transparent);
    backdrop-filter: blur(12px) saturate(1.1);
    -webkit-backdrop-filter: blur(12px) saturate(1.1);
    border-bottom: 1px solid transparent;
    transition: border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out);
  }
  header.site.scrolled { border-bottom-color: var(--border-hair); }
  .nav { display: flex; align-items: center; justify-content: space-between; height: 70px; }
  .brand { display: flex; align-items: center; gap: 9px; font-family: var(--font-display);
    font-size: 22px; font-weight: 500; letter-spacing: -0.01em; color: var(--ink-900); }
  .brand .dot { width: 11px; height: 11px; border-radius: 50%;
    background: radial-gradient(circle at 32% 30%, var(--plum-300), var(--plum-600) 75%);
    box-shadow: 0 0 0 4px var(--plum-50); }
  .nav-links { display: flex; gap: 30px; align-items: center; }
  .nav-links a { font-size: 14.5px; color: var(--ink-700); transition: color var(--dur-fast) var(--ease-out); }
  .nav-links a:hover { color: var(--ink-900); }
  .nav-actions { display: flex; align-items: center; gap: 8px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-body);
    font-weight: 500; line-height: 1; border-radius: var(--radius-pill); cursor: pointer;
    border: 1px solid transparent; white-space: nowrap; font-size: 14.5px; padding: 10px 20px;
    transition: transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out); }
  .btn:active { transform: translateY(1px); }
  .btn-primary { background: var(--accent-green); color: var(--cream-50); box-shadow: var(--shadow-sm); }
  .btn-primary:hover { filter: brightness(1.05); }
  .btn-ghost { background: transparent; color: var(--ink-700); }
  .btn-ghost:hover { background: var(--cream-200); color: var(--ink-900); }
  .btn-outline { background: transparent; color: var(--ink-900); border-color: var(--border-strong); }
  .btn-outline:hover { background: var(--cream-50); border-color: var(--ink-300); }
  .btn-lg { font-size: 16px; padding: 14px 28px; }

  /* ---- Hero ---- */
  .hero { padding: 84px 0 64px; position: relative; }
  .hero-grid { display: grid; grid-template-columns: 1.02fr 0.98fr; gap: 56px; align-items: center; }
  .hero h1 { font-size: clamp(46px, 5.4vw, 78px); font-weight: 400; line-height: 1.02; letter-spacing: -0.025em; }
  .hero h1 em { font-style: italic; font-weight: 300; color: var(--accent-purple); }
  .hero .lede { margin-top: 24px; font-size: 19px; line-height: 1.6; color: var(--ink-700); max-width: 32ch; }
  .hero-cta { margin-top: 34px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .hero-note { margin-top: 18px; font-family: var(--font-mono); font-size: 12.5px; color: var(--text-muted);
    display: flex; align-items: center; gap: 8px; }
  .hero-note svg { width: 15px; height: 15px; color: var(--accent-green); }

  /* ---- Hero product mock ---- */
  .mock { position: relative; }
  .mock-frame { background: var(--ink-900); border-radius: var(--radius-xl); padding: 12px;
    box-shadow: var(--shadow-lg); border: 1px solid #34312a; }
  .mock-bar { display: flex; align-items: center; gap: 7px; padding: 5px 8px 11px; }
  .mock-bar i { width: 9px; height: 9px; border-radius: 50%; background: #4b473d; display: inline-block; }
  .mock-bar .ttl { margin-left: 10px; font-family: var(--font-mono); font-size: 11px; color: #8a8576;
    display: flex; align-items: center; gap: 7px; }
  .mock-bar .live { color: #e98b82; }
  .mock-screen { background: var(--cream-50); border-radius: 14px; overflow: hidden;
    display: grid; grid-template-columns: 1fr 86px; height: 322px; }
  .mock-stage { position: relative; padding: 13px; display: flex; flex-direction: column; gap: 10px; }
  .mock-board { flex: 1; background: var(--cream-100);
    background-image: radial-gradient(var(--cream-300) 1px, transparent 1px); background-size: 17px 17px;
    border-radius: 10px; border: 1px solid var(--border-hair); position: relative; overflow: hidden; }
  .mock-board svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .mock-board .bd-write { position: absolute; z-index: 1; font-family: 'Caveat', cursive; font-weight: 700;
    line-height: 1; white-space: nowrap; }
  .mock-board .bd-write.q { color: var(--plum-600); font-size: 18px; transform: rotate(-2deg); white-space: normal; max-width: 56%; line-height: 1.28; }
  .mock-board .bd-write.a { color: var(--sage-700); font-size: 23px; transform: rotate(-1deg); }
  .cursor { position: absolute; display: flex; align-items: flex-start; gap: 4px; font-family: var(--font-mono); font-size: 9px; }
  .cursor span { background: var(--plum-500); color: #fff; padding: 1px 5px; border-radius: 7px; margin-top: 8px; transform: translateX(-2px); }
  .cursor.green span { background: var(--sage-600); }
  .cursor svg { width: 13px; height: 13px; }
  .mock-teacher { position: absolute; right: 13px; bottom: 13px; width: 96px; height: 64px; border-radius: 9px;
    background: linear-gradient(140deg, var(--plum-200), var(--sage-200)); border: 2px solid var(--cream-50);
    box-shadow: var(--shadow-sm); display: flex; align-items: flex-end; padding: 5px; }
  .mock-teacher b { font-family: var(--font-mono); font-size: 8.5px; color: #fff; background: rgba(35,33,28,.55);
    padding: 1px 5px; border-radius: 5px; }
  .mock-rail { background: var(--cream-200); border-left: 1px solid var(--border-hair); padding: 11px 9px;
    display: flex; flex-direction: column; gap: 8px; }
  .tile { height: 50px; border-radius: 8px; border: 1px solid var(--border-hair); }
  .tile.a { background: linear-gradient(160deg, var(--sage-200), var(--sage-100)); }
  .tile.b { background: linear-gradient(160deg, var(--plum-200), var(--plum-100)); }
  .tile.c { background: linear-gradient(160deg, var(--cream-300), var(--cream-200)); }
  /* AI chip floating */
  .ai-chip { position: absolute; left: -22px; bottom: 40px; background: var(--cream-50);
    border: 1px solid var(--border-hair); border-radius: 14px; box-shadow: var(--shadow-lg);
    padding: 13px 15px; width: 232px; }
  .ai-chip .h { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
  .ai-chip .h b { font-size: 12px; color: var(--ink-900); font-weight: 600; }
  .ai-chip .h .badge { margin-left: auto; font-family: var(--font-mono); font-size: 9px; letter-spacing: .08em;
    color: var(--plum-600); background: var(--plum-50); padding: 2px 7px; border-radius: 6px; }
  .ai-chip .h svg { width: 15px; height: 15px; color: var(--accent-purple); }
  .ai-chip p { font-size: 11.5px; line-height: 1.5; color: var(--ink-700); }
  .ai-chip p .q { color: var(--text-muted); font-style: italic; display:block; margin-bottom: 4px; }

  /* ---- Marquee / trust ---- */
  .trust { padding: 30px 0 10px; border-top: 1px solid var(--border-hair); margin-top: 56px; }
  .trust-inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
  .trust-inner .t { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); }
  .trust-stats { display: flex; gap: 44px; }
  .stat b { font-family: var(--font-display); font-size: 30px; color: var(--ink-900); font-weight: 400; display: block; line-height: 1; }
  .stat span { font-size: 12.5px; color: var(--text-muted); }

  /* ---- Section scaffolding ---- */
  section.band { padding: 96px 0; }
  .band.sunken { background: var(--bg-sunken); }
  .sec-head { max-width: 640px; margin-bottom: 52px; }
  .sec-head.center { margin-left: auto; margin-right: auto; text-align: center; }
  .sec-head h2 { font-size: clamp(32px, 3.8vw, 50px); font-weight: 400; letter-spacing: -0.022em; line-height: 1.05; margin-top: 14px; }
  .sec-head h2 em { font-style: italic; font-weight: 300; color: var(--accent-green-deep); }
  .sec-head p { margin-top: 16px; font-size: 17.5px; line-height: 1.6; color: var(--ink-700); }

  /* ---- Hero features: bento ---- */
  .bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 18px; }
  .feat { background: var(--surface-card); border: 1px solid var(--border-hair); border-radius: var(--radius-lg);
    padding: 28px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;
    transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out); }
  .feat:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
  .feat.lg { grid-column: span 4; }
  .feat.sm { grid-column: span 2; }
  .feat.half { grid-column: span 3; }
  .ficon { width: 42px; height: 42px; border-radius: 11px; display: grid; place-items: center; margin-bottom: 16px; }
  .ficon svg { width: 21px; height: 21px; }
  .ficon.green { background: var(--sage-100); color: var(--sage-700); }
  .ficon.plum { background: var(--plum-100); color: var(--plum-700); }
  .feat h3 { font-size: 22px; font-weight: 500; letter-spacing: -0.015em; margin-bottom: 9px; }
  .feat p { font-size: 15px; line-height: 1.6; color: var(--ink-700); max-width: 46ch; }
  .feat .meta { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 7px; }
  .chip { font-family: var(--font-mono); font-size: 11px; color: var(--ink-700); background: var(--cream-200);
    border: 1px solid var(--border-hair); padding: 4px 10px; border-radius: var(--radius-pill); }
  .feat-art { position: absolute; right: -10px; top: -10px; opacity: .5; }

  /* mini AI conversation art inside big feature */
  .ai-thread { margin-top: 20px; display: flex; flex-direction: column; gap: 9px; max-width: 360px; }
  .bub { font-size: 13px; line-height: 1.45; padding: 9px 13px; border-radius: 13px; max-width: 86%; }
  .bub.you { align-self: flex-end; background: var(--sage-500); color: var(--cream-50); border-bottom-right-radius: 4px; }
  .bub.ai { align-self: flex-start; background: var(--cream-200); color: var(--ink-900); border-bottom-left-radius: 4px;
    border: 1px solid var(--border-hair); }
  .bub.ai .src { display: block; margin-top: 6px; font-family: var(--font-mono); font-size: 10px; color: var(--plum-600); }

  /* Bento tiles are flex columns so their visuals stretch to fill the row height */
  .feat { display: flex; flex-direction: column; }
  .feat > p { flex: 0 0 auto; }

  /* lg tile: two-column split â copy left, whiteboard right */
  .lg-split { display: grid; grid-template-columns: 1.02fr 0.98fr; gap: 26px; align-items: stretch; height: 100%; }
  .lg-copy { display: flex; flex-direction: column; }
  .lg-copy .meta { margin-top: auto; }
  .wb-mock { margin-top: 0; flex: 1 1 auto; min-height: 240px; border-radius: 13px;
    background: var(--cream-100); background-image: radial-gradient(var(--cream-300) 1px, transparent 1px);
    background-size: 18px 18px; border: 1px solid var(--border-hair); position: relative; overflow: hidden; }
  .wb-mock .wb-ink { position: absolute; inset: 0; width: 100%; height: 100%; }
  .wb-write { position: absolute; z-index: 1; font-family: 'Caveat', cursive; font-weight: 700;
    font-size: 30px; line-height: 1; white-space: nowrap; letter-spacing: .01em; }
  .wb-write.eq { color: var(--plum-600); transform: rotate(-2.5deg); }
  .wb-write.roots { color: var(--sage-700); transform: rotate(-1.5deg); }
  .wb-cursor { position: absolute; display: flex; align-items: flex-start; gap: 4px;
    font-family: var(--font-mono); font-size: 10px; z-index: 2; }
  .wb-cursor i, .wb-cursor svg { width: 15px; height: 15px; }
  .wb-cursor span { color: #fff; padding: 1px 6px; border-radius: 7px; margin-top: 9px; transform: translateX(-2px); }
  .wb-cursor.g { color: var(--sage-600); } .wb-cursor.g span { background: var(--sage-600); }
  .wb-cursor.p { color: var(--plum-500); } .wb-cursor.p span { background: var(--plum-500); }
  .wb-face { position: absolute; right: 14px; bottom: 14px; width: 92px; height: 60px; border-radius: 9px;
    background: linear-gradient(140deg, var(--plum-200), var(--sage-200)); border: 2px solid var(--cream-50);
    box-shadow: var(--shadow-sm); display: flex; align-items: flex-end; padding: 5px; }
  .wb-face b { font-family: var(--font-mono); font-size: 8.5px; color: #fff; background: rgba(35,33,28,.55); padding: 1px 5px; border-radius: 5px; white-space: nowrap; }
  .feat .meta { margin-top: 18px; }

  /* sm tile: mini live-listen panel */
  .mini-live { margin-top: 16px; flex: 1 1 auto; display: flex; flex-direction: column; gap: 9px;
    background: var(--cream-100); border: 1px solid var(--border-hair); border-radius: 11px; padding: 13px; }
  .ml-head { font-family: var(--font-mono); font-size: 10px; letter-spacing: .05em; color: var(--text-muted);
    display: flex; align-items: center; gap: 6px; }
  .ml-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sage-600); }
  .ml-line { font-size: 12.5px; line-height: 1.5; color: var(--ink-700); }
  .ml-line b { color: var(--ink-900); }
  .ml-ask { margin-top: auto; font-family: var(--font-mono); font-size: 11px; color: var(--plum-600);
    display: flex; align-items: center; gap: 6px; }
  .ml-ask i, .ml-ask svg { width: 13px; height: 13px; }

  /* half tile: "one calm place" mini dashboard list */
  .place-list { margin-top: 20px; flex: 1 1 auto; display: flex; flex-direction: column; gap: 9px; justify-content: center; }
  .pl-item { display: flex; align-items: center; gap: 11px; padding: 11px 13px; border-radius: 10px;
    background: var(--cream-100); border: 1px solid var(--border-hair); font-size: 14px; color: var(--ink-900);
    transition: border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out); }
  .pl-item:hover { border-color: var(--sage-300); background: var(--cream-50); }
  .pl-item i, .pl-item svg { width: 17px; height: 17px; color: var(--accent-green-deep); flex-shrink: 0; }
  .pl-item span { font-weight: 500; }
  .pl-item em { margin-left: auto; font-family: var(--font-mono); font-size: 11px; font-style: normal; color: var(--text-muted); white-space: nowrap; }

  /* half tile: AI thread footer */
  .ai-thread { margin-top: auto; }
  .ai-foot { margin-top: 14px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .04em;
    color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
  .ai-foot i, .ai-foot svg { width: 13px; height: 13px; color: var(--accent-purple); }

  .wb-cursor.g { animation: glideA 7s var(--ease-soft) infinite; }
  .wb-cursor.p { animation: glideB 8.5s var(--ease-soft) infinite; }
  .ml-dot { animation: livePulse 1.5s var(--ease-soft) infinite; }
  @media (prefers-reduced-motion: reduce) { .wb-cursor.g, .wb-cursor.p, .ml-dot { animation: none !important; } }
  body.no-anim .wb-cursor.g, body.no-anim .wb-cursor.p, body.no-anim .ml-dot { animation: none !important; }

  /* ---- How it works ---- */
  .steps { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; position: relative; }
  /* dim base track */
  .steps::before { content: ""; position: absolute; left: 8%; right: 8%; top: 26px; height: 2px;
    background: var(--border-hair); border-radius: 2px; }
  /* scroll-driven fill that sweeps left â right, lighting each step as it passes */
  .steps-fill { position: absolute; left: 8%; top: 25px; height: 3px; width: 0; z-index: 0;
    background: var(--accent-green-deep);
    border-radius: 3px; box-shadow: 0 0 14px color-mix(in srgb, var(--accent-green-deep) 75%, transparent);
    transition: width .4s var(--ease-out); }
  .step { text-align: center; padding: 0 14px; position: relative;
    opacity: .48; transition: opacity .5s var(--ease-out); }
  .step.is-lit { opacity: 1; }
  .step .n { width: 52px; height: 52px; margin: 0 auto 18px; border-radius: 50%; background: var(--cream-50);
    border: 1px solid var(--border-strong); display: grid; place-items: center; font-family: var(--font-display);
    font-size: 20px; color: var(--ink-900); box-shadow: var(--shadow-xs); position: relative; z-index: 1;
    transition: background .5s var(--ease-out), color .5s var(--ease-out), border-color .5s var(--ease-out),
                box-shadow .5s var(--ease-out), transform .5s var(--ease-out); }
  .step.is-lit .n { background: linear-gradient(150deg, var(--plum-500), var(--accent-purple));
    color: var(--cream-50); border-color: transparent; transform: translateY(-3px) scale(1.07);
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent-purple) 16%, transparent),
                0 10px 24px color-mix(in srgb, var(--accent-purple) 34%, transparent); }
  /* the leading (most recently lit) step gets a gentle live glow while it sweeps */
  .step.is-active .n { animation: stepGlow 2.2s var(--ease-soft) infinite; }
  @keyframes stepGlow {
    0%, 100% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent-purple) 16%, transparent),
                           0 10px 24px color-mix(in srgb, var(--accent-purple) 32%, transparent); }
    50%      { box-shadow: 0 0 0 11px color-mix(in srgb, var(--accent-purple) 6%, transparent),
                           0 12px 30px color-mix(in srgb, var(--accent-purple) 46%, transparent); }
  }
  .step h4 { font-family: var(--font-body); font-size: 16px; font-weight: 600; color: var(--ink-900); margin-bottom: 6px; }
  .step p { font-size: 13.5px; line-height: 1.5; color: var(--text-muted); }
  @media (prefers-reduced-motion: reduce) {
    .step, .step .n { opacity: 1 !important; transition: none !important; }
    .step.is-active .n { animation: none !important; }
  }
  body.no-anim .step { opacity: 1 !important; }
  body.no-anim .step .n { transition: none !important; }
  body.no-anim .step.is-active .n { animation: none !important; }

  /* ---- Feature catalogue ---- */
  /* ---- Feature catalogue: pinned scrollspy ---- */
  .spy-pin { position: relative; }
  /* JS adds .is-pinning once measured â tall track that the stage pins within */
  .spy-pin.is-pinning { height: 320vh; }
  .spy-stage { display: flex; flex-direction: column; }
  .spy-pin.is-pinning .spy-stage { position: sticky; top: 70px; min-height: calc(100vh - 70px);
    justify-content: center; padding: 32px 0; box-sizing: border-box; overflow: hidden; }
  .spy-pin.is-pinning .sec-head { margin-bottom: 34px; }

  .spy { display: grid; grid-template-columns: 300px 1fr; gap: 56px; align-items: start; }
  .spy-rail { position: sticky; top: 104px; display: flex; flex-direction: column; gap: 6px; padding-left: 20px; }
  .spy-pin.is-pinning .spy-rail { position: static; top: auto; }
  .spy-rail .spy-progress { position: absolute; left: 0; top: 8px; bottom: 8px; width: 2px;
    background: var(--border-hair); border-radius: 2px; overflow: hidden; }
  .spy-progress-fill { position: absolute; left: 0; top: 0; width: 100%; height: 33.33%;
    background: linear-gradient(var(--accent-green), var(--accent-purple)); border-radius: 2px;
    transition: transform var(--dur-base) var(--ease-out); transform: translateY(0); }
  .spy-link { display: flex; gap: 15px; align-items: baseline; padding: 16px 6px; cursor: pointer;
    opacity: .42; transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
    border-radius: var(--radius-md); }
  .spy-link:hover { opacity: .72; }
  .spy-link.is-active { opacity: 1; }
  .spy-n { font-family: var(--font-mono); font-size: 12px; color: var(--accent-purple); letter-spacing: .04em;
    padding-top: 4px; transition: color var(--dur-base) var(--ease-out); }
  .spy-t { display: flex; flex-direction: column; gap: 5px; }
  .spy-t b { font-family: var(--font-display); font-size: 25px; font-weight: 400; letter-spacing: -0.02em;
    color: var(--ink-900); line-height: 1.05; }
  .spy-t i { font-style: normal; font-size: 13.5px; line-height: 1.5; color: var(--text-muted);
    max-height: 0; opacity: 0; overflow: hidden;
    transition: max-height var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out); }
  .spy-link.is-active .spy-t i { max-height: 48px; opacity: 1; }

  .spy-panels { display: flex; flex-direction: column; gap: 20px; }
  .spy-panel { opacity: .5; transition: opacity var(--dur-base) var(--ease-out); }
  .spy-panel.is-active { opacity: 1; }
  /* Pinned mode: panels stack in one place and crossfade */
  .spy-pin.is-pinning .spy-panels { position: relative; display: block; min-height: 340px; }
  .spy-pin.is-pinning .spy-panel { position: absolute; inset: 0; opacity: 0; transform: translateY(16px);
    pointer-events: none; transition: opacity .45s var(--ease-out), transform .45s var(--ease-out); }
  .spy-pin.is-pinning .spy-panel.is-active { opacity: 1; transform: none; pointer-events: auto; }
  .spy-head { margin-bottom: 16px; }
  .spy-head .eyebrow { display: none; }
  .spy-pin.is-pinning .spy-head .eyebrow { display: block; }
  .cat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .row-feat { display: flex; gap: 13px; padding: 18px 20px; border-radius: var(--radius-md);
    background: var(--surface-card); border: 1px solid var(--border-hair);
    transition: border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out); }
  .row-feat:hover { border-color: var(--sage-300); background: var(--cream-50); transform: translateY(-2px); }
  .row-feat .ic { flex-shrink: 0; width: 32px; height: 32px; border-radius: 8px; display: grid; place-items: center;
    background: var(--cream-200); color: var(--accent-green-deep);
    transition: background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out); }
  .spy-panel.is-active .row-feat .ic { background: var(--sage-100); }
  .row-feat .ic svg { width: 17px; height: 17px; }
  .row-feat h5 { font-family: var(--font-body); font-size: 14.5px; font-weight: 600; color: var(--ink-900); margin: 1px 0 4px; }
  .row-feat p { font-size: 12.8px; line-height: 1.5; color: var(--text-muted); }

  /* ---- Why / differentiators ---- */
  .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .why { padding: 4px 0; }
  .why .k { font-family: var(--font-mono); font-size: 12px; color: var(--accent-purple); letter-spacing: .06em; }
  .why h4 { font-family: var(--font-display); font-size: 22px; font-weight: 400; margin: 14px 0 9px; letter-spacing: -0.015em; }
  .why p { font-size: 14.5px; line-height: 1.6; color: var(--ink-700); }
  .why .ln { height: 2px; width: 34px; background: var(--sage-400, var(--sage-300)); border-radius: 2px; margin-bottom: 16px; }

  /* ---- Closing CTA ---- */
  .cta-band { background: var(--ink-900); border-radius: var(--radius-xl); padding: 72px 56px; text-align: center;
    position: relative; overflow: hidden; }
  .cta-band::before { content:""; position: absolute; inset: 0; opacity: .5;
    background: radial-gradient(680px 320px at 20% -10%, rgba(131,107,166,.45), transparent 60%),
                radial-gradient(620px 320px at 85% 120%, rgba(110,148,97,.42), transparent 60%); }
  .cta-band > * { position: relative; }
  .cta-band .eyebrow { color: var(--plum-300); }
  .cta-band h2 { color: var(--cream-50); font-size: clamp(34px, 4vw, 56px); font-weight: 400; letter-spacing: -0.02em; margin: 14px auto 0; max-width: 16ch; }
  .cta-band h2 em { font-style: italic; font-weight: 300; color: var(--sage-300); }
  .cta-band p { color: #cfc9bb; font-size: 17px; margin: 18px auto 0; max-width: 44ch; line-height: 1.6; }
  .cta-band .hero-cta { justify-content: center; margin-top: 32px; }
  .btn-cream { background: var(--cream-50); color: var(--ink-900); }
  .btn-cream:hover { filter: brightness(0.97); }
  .btn-line { background: transparent; color: var(--cream-100); border-color: rgba(247,243,233,.28); }
  .btn-line:hover { background: rgba(247,243,233,.08); }

  /* ---- Footer ---- */
  footer.site { padding: 64px 0 40px; border-top: 1px solid var(--border-hair); }
  .foot { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 30px; }
  .foot .brand { margin-bottom: 14px; }
  .foot p { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; max-width: 30ch; }
  .foot h6 { font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
    color: var(--text-faint); margin: 0 0 14px; font-weight: 500; }
  .foot ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
  .foot ul a { font-size: 14px; color: var(--ink-700); }
  .foot ul a:hover { color: var(--ink-900); }
  .foot-base { display: flex; justify-content: space-between; align-items: center; margin-top: 48px;
    padding-top: 22px; border-top: 1px solid var(--border-hair); font-size: 12.5px; color: var(--text-muted); }
  .foot-credit { margin-top: 16px; text-align: center; font-family: var(--font-mono);
    font-size: 11px; letter-spacing: .08em; color: var(--text-faint); }

  /* ---- Reveal animation ----
     Base = visible (so it always renders, even with no JS / no support).
     â¢ Modern browsers: each element's entrance is SCROLL-LINKED via animation-timeline:view()
       â it transitions in progressively as it travels up into the viewport (see @supports below).
     â¢ Fallback browsers: JS arms below-fold elements with .pending, then swaps to .in. */
  .reveal { opacity: 1; transform: none; }
  .reveal.pending { opacity: 0; transform: translateY(22px); }
  .reveal.in { animation: revealUp .7s var(--ease-out) both; }
  .reveal.in.d1 { animation-delay: .08s; } .reveal.in.d2 { animation-delay: .16s; }
  .reveal.in.d3 { animation-delay: .24s; } .reveal.in.d4 { animation-delay: .32s; }
  @keyframes revealUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) {
    .reveal, .reveal.pending, .reveal.in { opacity: 1 !important; transform: none !important; animation: none !important; }
  }

  /* ---- Directional / zoom reveal variants ---- */
  .reveal.from-right.in { animation-name: revealRight; }
  .reveal.from-left.in  { animation-name: revealLeft; }
  .reveal.zoom.in       { animation-name: revealZoom; }
  @keyframes revealRight { from { opacity: 0; transform: translateX(46px); }            to { opacity: 1; transform: none; } }
  @keyframes revealLeft  { from { opacity: 0; transform: translateX(-46px); }           to { opacity: 1; transform: none; } }
  @keyframes revealZoom  { from { opacity: 0; transform: translateY(24px) scale(.955); } to { opacity: 1; transform: none; } }

  /* ---- Scroll-LINKED reveals (Chromium/modern). Progress tracks each element's
     position in the viewport: it animates in as you scroll it up, out as it leaves. ---- */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      body:not(.no-anim) .reveal {
        opacity: 1;
        animation-name: revealUp;
        animation-fill-mode: both;
        animation-timing-function: linear;
        animation-timeline: view();
        animation-range: entry 4% cover 34%;
      }
      body:not(.no-anim) .reveal.from-right { animation-name: revealRight; }
      body:not(.no-anim) .reveal.from-left  { animation-name: revealLeft; }
      body:not(.no-anim) .reveal.zoom       { animation-name: revealZoom; }
      /* the hero block is already in view at load â let it settle quickly, not on scroll */
      body:not(.no-anim) .hero .reveal { animation-range: entry 0% entry 1%; }
    }
  }

  /* Stat numbers pop in when the trust strip reveals */
  @keyframes pop { from { opacity: 0; transform: translateY(10px) scale(.9); } to { opacity: 1; transform: none; } }
  .trust-stats .stat b { display: inline-block; }
  .trust.in .trust-stats .stat:nth-child(1) b { animation: pop .55s var(--ease-out) .10s both; }
  .trust.in .trust-stats .stat:nth-child(2) b { animation: pop .55s var(--ease-out) .20s both; }
  .trust.in .trust-stats .stat:nth-child(3) b { animation: pop .55s var(--ease-out) .30s both; }

  /* ---- "Live" motion inside the hero mock ---- */
  @keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(.72); } }
  .mock-bar .live { display: inline-block; animation: livePulse 1.5s var(--ease-soft) infinite; }
  .ai-chip .badge { display: inline-flex; align-items: center; gap: 5px; }
  .ai-chip .badge::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: var(--plum-500);
    animation: livePulse 1.5s var(--ease-soft) infinite; }

  @keyframes glideA { 0% { transform: translate(0,0); } 35% { transform: translate(16px,-12px); } 70% { transform: translate(-6px,6px); } 100% { transform: translate(0,0); } }
  @keyframes glideB { 0% { transform: translate(0,0); } 40% { transform: translate(-14px,9px); } 75% { transform: translate(9px,-5px); } 100% { transform: translate(0,0); } }
  .cursor.green       { animation: glideA 7s var(--ease-soft) infinite; }
  .cursor:not(.green) { animation: glideB 8.5s var(--ease-soft) infinite; }

  /* Active-speaker ring cycles through the rail tiles */
  @keyframes speak { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,148,97,0); } 6%, 18% { box-shadow: 0 0 0 2px var(--sage-500); } 24% { box-shadow: 0 0 0 0 rgba(110,148,97,0); } }
  .mock-rail .tile { animation: speak 9s var(--ease-soft) infinite; }
  .mock-rail .tile:nth-child(2) { animation-delay: 2.25s; }
  .mock-rail .tile:nth-child(3) { animation-delay: 4.5s; }
  .mock-rail .tile:nth-child(4) { animation-delay: 6.75s; }

  /* Whiteboard ink dot settles in */
  @keyframes inkdot { 0%, 55% { opacity: 0; transform: scale(.2); } 100% { opacity: 1; transform: scale(1); } }
  .mock-board svg circle { transform-origin: center; transform-box: fill-box; animation: inkdot 2.6s var(--ease-out) forwards; }

  /* AI chip floats gently */
  @keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
  .ai-chip { animation: floaty 5.5s var(--ease-soft) infinite; }

  /* Header brand dot breathes */
  @keyframes breathe { 0%, 100% { box-shadow: 0 0 0 4px var(--plum-50); } 50% { box-shadow: 0 0 0 7px rgba(131,107,166,.10); } }
  .brand .dot { animation: breathe 3.2s var(--ease-soft) infinite; }

  /* Scroll progress bar */
  #scrollbar { position: fixed; top: 0; left: 0; height: 3px; width: 0; z-index: 100; border-radius: 0 3px 3px 0;
    background: linear-gradient(90deg, var(--sage-500), var(--accent-purple)); transition: width .08s linear; }

  /* Disable all decorative loops when motion is off */
  @media (prefers-reduced-motion: reduce) {
    .mock-bar .live, .ai-chip, .ai-chip .badge::before, .cursor, .mock-rail .tile,
    .mock-board svg circle, .brand .dot, .trust-stats .stat b { animation: none !important; }
  }
  body.no-anim .mock-bar .live, body.no-anim .ai-chip, body.no-anim .ai-chip .badge::before,
  body.no-anim .cursor, body.no-anim .mock-rail .tile,
  body.no-anim .mock-board svg circle, body.no-anim .brand .dot, body.no-anim .trust-stats .stat b { animation: none !important; }
  body.no-anim #scrollbar { display: none; }

  /* ---- Responsive ---- */
  @media (max-width: 960px) {
    .hero-grid { grid-template-columns: 1fr; gap: 40px; }
    .ai-chip { left: auto; right: 14px; bottom: 14px; }
    .bento .feat.lg, .bento .feat.sm, .bento .feat.half { grid-column: span 6; }
    .lg-split { grid-template-columns: 1fr; gap: 20px; }
    .wb-mock { min-height: 190px; }
    .steps { grid-template-columns: repeat(2, 1fr); gap: 30px 14px; } .steps::before, .steps-fill { display: none; }
    .cat { grid-template-columns: 1fr; gap: 22px; } .cat-label { position: static; }
    .cat-grid { grid-template-columns: 1fr; }
    .spy { grid-template-columns: 1fr; gap: 28px; }
    .spy-rail { position: static; flex-direction: row; flex-wrap: wrap; gap: 10px; padding-left: 0; }
    .spy-rail .spy-progress { display: none; }
    .spy-link { opacity: 1; padding: 10px 14px; border: 1px solid var(--border-hair); background: var(--surface-card); }
    .spy-link.is-active { border-color: var(--sage-300); background: var(--cream-50); }
    .spy-t i { display: none; }
    .spy-t b { font-size: 18px; }
    .spy-panel { min-height: 0; opacity: 1; }
    .spy-head .eyebrow { display: block; margin-bottom: 4px; }
    .foot { grid-template-columns: 1fr 1fr; } .nav-links { display: none; }
  }


  #tweaks { position: fixed; right: 20px; bottom: 20px; z-index: 200; width: 280px;
    background: var(--cream-50); border: 1px solid var(--border-strong); border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg); font-family: var(--font-body); display: none; overflow: hidden; }
  #tweaks.open { display: block; }
  #tweaks .tk-head { display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; border-bottom: 1px solid var(--border-hair); }
  #tweaks .tk-head b { font-family: var(--font-display); font-size: 17px; color: var(--ink-900); font-weight: 500; }
  #tweaks .tk-x { cursor: pointer; border: none; background: transparent; color: var(--ink-500);
    font-size: 18px; line-height: 1; padding: 4px; border-radius: 6px; }
  #tweaks .tk-x:hover { background: var(--cream-200); color: var(--ink-900); }
  #tweaks .tk-body { padding: 16px; display: flex; flex-direction: column; gap: 18px; }
  #tweaks .tk-row .tk-label { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .1em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 9px; }
  #tweaks .seg { display: flex; gap: 4px; background: var(--cream-200); padding: 3px; border-radius: var(--radius-pill); }
  #tweaks .seg button { flex: 1; border: none; background: transparent; cursor: pointer; font-family: var(--font-body);
    font-size: 12.5px; font-weight: 500; color: var(--ink-500); padding: 7px 6px; border-radius: var(--radius-pill);
    transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out); }
  #tweaks .seg button[aria-pressed="true"] { background: var(--cream-50); color: var(--ink-900); box-shadow: var(--shadow-xs); }
  #tweaks .sw-row { display: flex; gap: 10px; }
  #tweaks .sw { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; border: 2px solid transparent;
    box-shadow: var(--shadow-xs); transition: transform var(--dur-fast) var(--ease-out); }
  #tweaks .sw:hover { transform: scale(1.08); }
  #tweaks .sw[aria-pressed="true"] { border-color: var(--ink-900); }
  #tweaks .tog { display: flex; align-items: center; justify-content: space-between; }
  #tweaks .tog span { font-size: 13.5px; color: var(--ink-700); }
  #tweaks .switch { width: 42px; height: 24px; border-radius: 999px; background: var(--cream-300); border: none;
    cursor: pointer; position: relative; transition: background var(--dur-fast) var(--ease-out); }
  #tweaks .switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
    border-radius: 50%; background: var(--cream-50); box-shadow: var(--shadow-xs); transition: transform var(--dur-fast) var(--ease-out); }
  #tweaks .switch[aria-pressed="true"] { background: var(--accent-green); }
  #tweaks .switch[aria-pressed="true"]::after { transform: translateX(18px); }
  body.no-anim .reveal { animation: none !important; opacity: 1 !important; transform: none !important; }
`;

const PAGE_HTML = `

<div id="scrollbar"></div>

<header class="site" id="hdr">
  <div class="wrap nav">
    <div class="brand">OpenGrapes</div>
    <nav class="nav-links">
      <a href="#features">Features</a>
      <a href="#ai">AI</a>
      <a href="#how">How it works</a>
      <a href="#lms">Platform</a>
    </nav>
    <div class="nav-actions">
      <button class="btn btn-primary" data-og-signin="true">Sign in</button>
    </div>
  </div>
</header>

<!-- ================= HERO ================= -->
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <div class="eyebrow reveal">All-in-one live teaching platform</div>
      <h1 class="reveal d1" id="heroTitle">Live classes that<br><em>remember</em><br>everything.</h1>
      <p class="lede reveal d2" id="heroLede">A live classroom, a shared whiteboard, and an AI that remembers every session â one calm place for teachers to teach and students to never miss a thing.</p>
      <div class="hero-cta reveal d3">
        <button class="btn btn-primary btn-lg" data-og-signin="true">Get Started</button>
      </div>
      <div class="hero-note reveal d3"><i data-lucide="check-circle-2"></i> One-click join Â· no installs Â· reliable on any network</div>
    </div>

    <div class="mock reveal d2">
      <div class="mock-frame">
        <div class="mock-bar"><i></i><i></i><i></i>
          <span class="ttl"><span class="live">â</span> Physics Â· Batch A â Live</span>
        </div>
        <div class="mock-screen">
          <div class="mock-stage">
            <div class="mock-board">
              <div class="bd-write q" style="left:7%; top:10%">Q: A train covers 240 km in 3 hours. Find its speed.</div>
              <div class="bd-write a" style="left:6.5%; top:37%">= 80 km/h</div>
              <div class="cursor" style="left:70%; top:12%"><i data-lucide="mouse-pointer-2"></i><span>Ms.Iyer</span></div>
              <div class="cursor green" style="left:45%; top:40%"><i data-lucide="mouse-pointer-2"></i><span>Anya</span></div>
              <div class="mock-teacher"><b>Ms. Iyer</b></div>
            </div>
          </div>
          <div class="mock-rail">
            <div class="tile a"></div><div class="tile b"></div><div class="tile c"></div>
            <div class="tile a"></div>
          </div>
        </div>
      </div>
      <div class="ai-chip">
        <div class="h"><i data-lucide="sparkles"></i><b>OpenGrapes AI</b><span class="badge">LIVE</span></div>
        <p><span class="q">"What was the deadline she just mentioned?"</span>The lab report is due Friday, 6 PM â noted at 12:04 in today's class.</p>
      </div>
    </div>
  </div>

</section>

<!-- ================= HERO FEATURES (bento) ================= -->
<section class="band" id="features">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="eyebrow">The main attractions</div>
      <h2 id="featuresHead">Classes run better<br><em>for everyone.</em></h2>
    </div>
    <div class="bento">
      <article class="feat lg reveal">
        <div class="lg-split">
          <div class="lg-copy">
            <div class="ficon green"><i data-lucide="pen-tool"></i></div>
            <h3>Seamless collaborative whiteboard</h3>
            <p>Recreate the classroom experience online with a collaborative whiteboard. Teachers can invite students to the board to solve live, backed by smart permissions that prevent classroom chaos.</p>
            <div class="meta"><span class="chip">Live cursors</span><span class="chip">Infinite canvas</span><span class="chip">Lag-free sync</span><span class="chip">Draw together</span></div>
          </div>
          <div class="wb-mock">
            <div class="wb-write eq" style="left:11%; top:24%">xÂ² â 5x + 6 = 0</div>
            <div class="wb-write roots" style="left:20%; top:54%">x = 2 ,&nbsp; x = 3</div>
            <div class="wb-cursor p" style="left:60%; top:22%"><i data-lucide="mouse-pointer-2"></i><span>Manas</span></div>
            <div class="wb-cursor g" style="left:56%; top:52%"><i data-lucide="mouse-pointer-2"></i><span>Rohit</span></div>
            <div class="wb-face"><b>Mr.Manas</b></div>
          </div>
        </div>
      </article>

      <article class="feat sm reveal d1">
        <div class="ficon green"><i data-lucide="radio"></i></div>
        <h3>In-meeting AI</h3>
        <p>Zoned out for a minute? AI didn't. Ask about deadlines, explanations, or anything your teacher said â without interrupting the class.</p>
        <div class="mini-live">
          <div class="ml-head"><span class="ml-dot"></span> Listening Â· 12:04</div>
          <div class="ml-line"><b>Ms. Iyer:</b> â¦the lab report is due Friday, 6 PM.</div>
          <div class="ml-ask"><i data-lucide="corner-down-right"></i> Ask anything you missed</div>
        </div>
        <div class="meta"><span class="chip">Rolling summaries</span><span class="chip">End-of-class MoM</span></div>
      </article>

      <article class="feat half reveal d2">
        <div class="ficon plum"><i data-lucide="layout-dashboard"></i></div>
        <h3 id="featD_h3">One calm place for the whole class</h3>
        <p id="featD_p">Classes, notes, tests, and fees in one clean, fast place â teachers run the batch and students always know what's next, what's due, and where to revise.</p>
        <div class="place-list">
          <div class="pl-item"><i data-lucide="notebook-pen"></i><span>Notes &amp; material</span><em>4 new</em></div>
          <div class="pl-item"><i data-lucide="list-checks"></i><span>Tests</span><em>2 live</em></div>
          <div class="pl-item"><i data-lucide="wallet"></i><span>Fees</span><em>on track</em></div>
          <div class="pl-item"><i data-lucide="users"></i><span>Students</span><em>28 active</em></div>
        </div>
      </article>

      <article class="feat half reveal d3">
        <div class="ficon plum"><i data-lucide="sparkles"></i></div>
        <h3>OpenGrapes AI â an assistant that knows your classes</h3>
        <p>It pulls context from any meeting in the batch, including past sessions, and answers grounded in what was actually taught.</p>
        <div class="ai-thread">
          <div class="bub you">What did we cover about Newton's third law last week?</div>
          <div class="bub ai">Actionâreaction pairs, with the rocket-thrust example from Tuesday's class.<span class="src">â³ grounded in Batch A Â· 3 past sessions</span></div>
          <div class="bub you">And the deadline she mentioned today?</div>
          <div class="bub ai">Lab report â Friday, 6 PM.<span class="src">â³ noted at 12:04 in today's class</span></div>
        </div>
        <div class="ai-foot"><i data-lucide="sparkles"></i> Every past class becomes a knowledge base your batch can query</div>
      </article>
    </div>
  </div>
</section>

<!-- ================= HOW IT WORKS ================= -->
<section class="band sunken" id="how">
  <div class="wrap">
    <div class="sec-head center reveal">
      <div class="eyebrow">How it works</div>
      <h2>Five steps, <em>one place.</em></h2>
    </div>
    <div class="steps" id="stepsRow">
      <span class="steps-fill" aria-hidden="true"></span>
      <div class="step"><div class="n">1</div><h4>Schedule a class</h4><p>Set up a live session from your dashboard.</p></div>
      <div class="step"><div class="n">2</div><h4>Teach live</h4><p>Video, audio &amp; whiteboard, with AI listening in the background.</p></div>
      <div class="step"><div class="n">3</div><h4>AI captures it</h4><p>Rolling summaries during class, a full recap at the end.</p></div>
      <div class="step"><div class="n">4</div><h4>Students revise</h4><p>Ask OpenGrapes AI any doubt about any class, anytime.</p></div>
      <div class="step"><div class="n">5</div><h4>Manage the batch</h4><p>Publish notes, assign tests, track fees in one place.</p></div>
    </div>
  </div>
</section>

<!-- ================= FEATURE CATALOGUE (pinned scrollspy) ================= -->
<section class="band" id="ai">
  <div class="wrap">
   <div class="spy-pin" id="spyPin">
    <div class="spy-stage">
    <div class="sec-head reveal">
      <div class="eyebrow">The full set</div>
      <h2>Everything that makes a class<br>run itself.</h2>
      <p>Grouped the way a teaching day actually flows â the live room, the AI layer that remembers it, and the backend that keeps the batch organized.</p>
    </div>

    <div class="spy">
      <!-- Sticky rail: all three headings together -->
      <nav class="spy-rail reveal" aria-label="Feature groups">
        <a class="spy-link is-active" href="#grp-live" data-target="grp-live">
          <span class="spy-n">01</span>
          <span class="spy-t"><b>Live classroom</b><i>An HD room built for teaching, reliable anywhere.</i></span>
        </a>
        <a class="spy-link" href="#grp-ai" data-target="grp-ai">
          <span class="spy-n">02</span>
          <span class="spy-t"><b>The AI layer</b><i>Listens, remembers, and explains every class.</i></span>
        </a>
        <a class="spy-link" href="#grp-lms" data-target="grp-lms">
          <span class="spy-n">03</span>
          <span class="spy-t"><b>Batch management</b><i>Notes, tests, scheduling, fees â computed live.</i></span>
        </a>
        <span class="spy-progress"><span class="spy-progress-fill"></span></span>
      </nav>

      <!-- Content panels (crossfade while pinned) -->
      <div class="spy-panels">
        <article class="spy-panel is-active" id="grp-live" data-spy="grp-live">
          <header class="spy-head"><span class="eyebrow">01 â Live classroom</span></header>
          <div class="cat-grid">
            <div class="row-feat"><div class="ic"><i data-lucide="video"></i></div><div><h5>Live video &amp; audio</h5><p>Real-time HD for the whole batch on a scalable media server.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="pen-tool"></i></div><div><h5>Collaborative whiteboard</h5><p>See every cursor move in real time.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="mouse-pointer-2"></i></div><div><h5>Live cursor presence</h5><p>Every cursor shows with its participant's name label.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="door-open"></i></div><div><h5>One-click join</h5><p>Name, room, allow camera â you're in. No installs.</p></div></div>
          </div>
        </article>

        <article class="spy-panel" id="grp-ai" data-spy="grp-ai">
          <header class="spy-head"><span class="eyebrow">02 â The AI layer</span></header>
          <div class="cat-grid">
            <div class="row-feat"><div class="ic"><i data-lucide="brain"></i></div><div><h5>Knowledge assistant</h5><p>Context-aware Q&amp;A across any and all of the batch's meetings.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="message-circle-question"></i></div><div><h5>In-meeting doubt solver</h5><p>Ask about anything you missed, live during class.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="timer"></i></div><div><h5>Rolling summaries</h5><p>A fresh recap roughly every ten minutes of the session.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="file-text"></i></div><div><h5>End-of-class minutes</h5><p>A detailed AI recap delivered like minutes of the meeting.</p></div></div>
          </div>
        </article>

        <article class="spy-panel" id="grp-lms" data-spy="grp-lms">
          <header class="spy-head"><span class="eyebrow">03 â Batch management</span></header>
          <div class="cat-grid">
            <div class="row-feat"><div class="ic"><i data-lucide="notebook-pen"></i></div><div><h5>Notes &amp; study material</h5><p>Write, publish, edit and delete material in a click.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="list-checks"></i></div><div><h5>MCQ tests, auto-graded</h5><p>Marks per question, instant graded breakdown per student.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="calendar-clock"></i></div><div><h5>Meeting scheduling</h5><p>Upcoming Â· Live Â· Ended status, joinable in one tap.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="wallet"></i></div><div><h5>Fees management</h5><p>Live status, balances and full payment history.</p></div></div>
            <div class="row-feat"><div class="ic"><i data-lucide="user-check"></i></div><div><h5>Students &amp; approvals</h5><p>Approve, reject, revoke or restore access anytime.</p></div></div>
            <div class="row-feat" id="lms"><div class="ic"><i data-lucide="shield-check"></i></div><div><h5>Secure access</h5><p>Every action verified server-side by teacher/student role.</p></div></div>
          </div>
        </article>
      </div>
    </div>
    </div>
   </div>
  </div>
</section>

<!-- ================= CTA ================= -->
<section class="band">
  <div class="wrap reveal">
    <div class="cta-band">
      <div class="eyebrow">Run your whole batch from one place</div>
      <h2>Live classes that <em>remember everything.</em></h2>
      <p id="ctaP">Teach it, learn it, and never lose it â live classes that explain themselves, for everyone in the room.</p>
      <div class="hero-cta">
        <button class="btn btn-cream btn-lg" data-og-signin="true">Start teaching free</button>
        <button class="btn btn-line btn-lg">Book a walkthrough</button>
      </div>
    </div>
  </div>
</section>

<!-- ================= FOOTER ================= -->
<footer class="site">
  <div class="wrap">
    <div class="foot">
      <div>
        <div class="brand"><span class="dot"></span>OpenGrapes</div>
        <p>An all-in-one live teaching platform for independent educators. Teach live. Let AI handle the rest.</p>
      </div>
      <div><h6>Product</h6><ul><li><a href="#features">Features</a></li><li><a href="#ai">AI layer</a></li><li><a href="#lms">Platform</a></li><li><a href="#how">How it works</a></li></ul></div>
      <div><h6>For teachers</h6><ul><li><a href="#">Live classroom</a></li><li><a href="#">Whiteboard</a></li><li><a href="#">Tests &amp; notes</a></li><li><a href="#">Fees</a></li></ul></div>
      <div><h6>Company</h6><ul><li><a href="#">About</a></li><li><a href="#">Sign in</a></li><li><a href="#">Contact</a></li><li><a href="#">Privacy</a></li></ul></div>
    </div>
    <div class="foot-base">
      <span>Â© 2026 OpenGrapes. All rights reserved.</span>
      <span>Teach live. Let AI handle the rest.</span>
    </div>
    <div class="foot-credit">Created &amp; maintained by Manas &amp; Manas</div>
  </div>
</footer>



<!-- ===================== TWEAKS ===================== -->
<style>
  #tweaks { position: fixed; right: 20px; bottom: 20px; z-index: 200; width: 280px;
    background: var(--cream-50); border: 1px solid var(--border-strong); border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg); font-family: var(--font-body); display: none; overflow: hidden; }
  #tweaks.open { display: block; }
  #tweaks .tk-head { display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; border-bottom: 1px solid var(--border-hair); }
  #tweaks .tk-head b { font-family: var(--font-display); font-size: 17px; color: var(--ink-900); font-weight: 500; }
  #tweaks .tk-x { cursor: pointer; border: none; background: transparent; color: var(--ink-500);
    font-size: 18px; line-height: 1; padding: 4px; border-radius: 6px; }
  #tweaks .tk-x:hover { background: var(--cream-200); color: var(--ink-900); }
  #tweaks .tk-body { padding: 16px; display: flex; flex-direction: column; gap: 18px; }
  #tweaks .tk-row .tk-label { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .1em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 9px; }
  #tweaks .seg { display: flex; gap: 4px; background: var(--cream-200); padding: 3px; border-radius: var(--radius-pill); }
  #tweaks .seg button { flex: 1; border: none; background: transparent; cursor: pointer; font-family: var(--font-body);
    font-size: 12.5px; font-weight: 500; color: var(--ink-500); padding: 7px 6px; border-radius: var(--radius-pill);
    transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out); }
  #tweaks .seg button[aria-pressed="true"] { background: var(--cream-50); color: var(--ink-900); box-shadow: var(--shadow-xs); }
  #tweaks .sw-row { display: flex; gap: 10px; }
  #tweaks .sw { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; border: 2px solid transparent;
    box-shadow: var(--shadow-xs); transition: transform var(--dur-fast) var(--ease-out); }
  #tweaks .sw:hover { transform: scale(1.08); }
  #tweaks .sw[aria-pressed="true"] { border-color: var(--ink-900); }
  #tweaks .tog { display: flex; align-items: center; justify-content: space-between; }
  #tweaks .tog span { font-size: 13.5px; color: var(--ink-700); }
  #tweaks .switch { width: 42px; height: 24px; border-radius: 999px; background: var(--cream-300); border: none;
    cursor: pointer; position: relative; transition: background var(--dur-fast) var(--ease-out); }
  #tweaks .switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
    border-radius: 50%; background: var(--cream-50); box-shadow: var(--shadow-xs); transition: transform var(--dur-fast) var(--ease-out); }
  #tweaks .switch[aria-pressed="true"] { background: var(--accent-green); }
  #tweaks .switch[aria-pressed="true"]::after { transform: translateX(18px); }
  body.no-anim .reveal { animation: none !important; opacity: 1 !important; transform: none !important; }
</style>
<div id="tweaks" aria-label="Tweaks">
  <div class="tk-head"><b>Tweaks</b><button class="tk-x" id="tkClose" aria-label="Close">â</button></div>
  <div class="tk-body">
    <div class="tk-row">
      <div class="tk-label">Audience focus</div>
      <div class="seg" id="segAudience">
        <button data-v="everyone">Everyone</button>
        <button data-v="teachers">Teachers</button>
        <button data-v="students">Students</button>
      </div>
    </div>
    <div class="tk-row">
      <div class="tk-label">Primary accent</div>
      <div class="sw-row" id="swAccent">
        <button class="sw" data-v="#6E9461" style="background:#6E9461" aria-label="Sage green"></button>
        <button class="sw" data-v="#836BA6" style="background:#836BA6" aria-label="Muted plum"></button>
        <button class="sw" data-v="#587A4D" style="background:#587A4D" aria-label="Deep forest"></button>
      </div>
    </div>
    <div class="tk-row tog">
      <span>Scroll animations</span>
      <button class="switch" id="tkAnim" aria-pressed="true" aria-label="Toggle scroll animations"></button>
    </div>
  </div>
</div>




`;

const MAIN_JS = `
  lucide.createIcons();
  // Header border on scroll
  const hdr = document.getElementById('hdr');
  const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 8);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  // Reveal on scroll. Content is visible by default; only below-fold elements are
  // "armed" (hidden) at load, then animated in as they enter the viewport.
  // Assign reveal "flavors" before collecting, for livelier entrances.
  document.querySelector('.mock') && document.querySelector('.mock').classList.add('from-right');
  document.querySelectorAll('.feat').forEach(f => f.classList.add('zoom'));
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const vh0 = window.innerHeight || document.documentElement.clientHeight;
  // Modern browsers drive reveals purely via CSS animation-timeline:view() (scroll-linked).
  // Only arm the JS threshold fallback when that feature is unsupported.
  const useCssScrollReveal = (window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
  if (!useCssScrollReveal) {
    reveals.forEach(el => { if (el.getBoundingClientRect().top >= vh0 * 0.9) el.classList.add('pending'); });
  }
  // Scroll progress bar + subtle hero parallax
  const bar = document.getElementById('scrollbar');
  const mockFrame = document.querySelector('.mock-frame');
  function updateScrollFx() {
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    bar.style.width = (Math.min(window.scrollY / max, 1) * 100) + '%';
    if (mockFrame && !document.body.classList.contains('no-anim') && window.scrollY < 1000) {
      mockFrame.style.transform = 'translateY(' + (window.scrollY * -0.035) + 'px)';
    }
  }
  let ticking = false;
  function checkReveals() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (!useCssScrollReveal) {
      for (let i = reveals.length - 1; i >= 0; i--) {
        const el = reveals[i];
        if (el.getBoundingClientRect().top < vh * 0.9) {
          if (el.classList.contains('pending')) { el.classList.remove('pending'); el.classList.add('in'); }
          reveals.splice(i, 1);
        }
      }
    }
    updateScrollFx();
    ticking = false;
  }
  function requestCheck() { if (!ticking) { ticking = true; requestAnimationFrame(checkReveals); } }
  window.addEventListener('scroll', requestCheck, { passive: true });
  window.addEventListener('resize', requestCheck, { passive: true });
  checkReveals();
  // Failsafe: never leave content hidden
  setTimeout(() => reveals.slice().forEach(el => el.classList.remove('pending')), 1800);

  // ---- "How it works": scroll-driven activation sweep ----
  // A gradient line draws leftâright as you scroll the section into view,
  // lighting each numbered step in sequence; the leading step gently pulses.
  (function () {
    const row = document.getElementById('stepsRow');
    if (!row) return;
    const fill = row.querySelector('.steps-fill');
    const stepEls = Array.from(row.querySelectorAll('.step'));
    const N = stepEls.length;
    // fraction of scroll progress at which the fill reaches each circle's centre
    const centers = stepEls.map((_, i) => ((i + 0.5) / N * 100 - 8) / 84);
    function litAll() {
      if (fill) fill.style.width = '84%';
      stepEls.forEach(s => { s.classList.add('is-lit'); s.classList.remove('is-active'); });
    }
    function update() {
      const reduce = document.body.classList.contains('no-anim')
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) { litAll(); return; }
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (window.innerWidth <= 960) {                 // stacked on mobile: light each as it enters
        stepEls.forEach(s => s.classList.toggle('is-lit', s.getBoundingClientRect().top < vh * 0.85));
        return;
      }
      const r = row.getBoundingClientRect();
      const start = vh * 0.82, end = vh * 0.34;
      let p = (start - r.top) / (start - end);
      p = Math.max(0, Math.min(1, p));
      if (fill) fill.style.width = (p * 84) + '%';
      let frontier = -1;
      stepEls.forEach((s, i) => { const on = p >= centers[i]; s.classList.toggle('is-lit', on); if (on) frontier = i; });
      stepEls.forEach((s, i) => s.classList.toggle('is-active', i === frontier && p < 0.999));
    }
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(update), { passive: true });
    new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    update();
  })();

  // ---- Feature-catalogue PINNED scrollspy ----
  // The section pins to the viewport; scrolling cycles the three groups in place,
  // then normal scroll resumes. Falls back to plain stacked flow when disabled.
  const spyPin = document.getElementById('spyPin');
  const spyPanels = Array.from(document.querySelectorAll('.spy-panel'));
  const spyLinks = Array.from(document.querySelectorAll('.spy-link'));
  const spyFill = document.querySelector('.spy-progress-fill');
  if (spyPin && spyPanels.length) {
    const N = spyPanels.length;
    let spyActive = -1, pinning = null;

    function setSpy(idx) {
      idx = Math.max(0, Math.min(N - 1, idx));
      if (idx === spyActive) return;
      spyActive = idx;
      spyPanels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
      spyLinks.forEach((l, i) => l.classList.toggle('is-active', i === idx));
    }
    function setFill(progress) {
      if (spyFill) spyFill.style.transform = 'translateY(' + (progress * (N - 1) * 100) + '%)';
    }

    function enablePin() {
      const allow = window.innerWidth > 960 && !document.body.classList.contains('no-anim')
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (allow === pinning) return;
      pinning = allow;
      spyPin.classList.toggle('is-pinning', allow);
      if (!allow) { spyPanels.forEach(p => p.classList.add('is-active')); setFill(0); }
      else { setSpy(0); }
    }

    function spyScan() {
      if (!pinning) return;
      const total = spyPin.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-spyPin.getBoundingClientRect().top, 0), total);
      const progress = scrolled / total;              // 0 â 1 across the pin
      setFill(progress);
      setSpy(Math.floor(progress * N - 1e-6));          // which of N segments
    }

    // Rail clicks jump to that group's segment within the pin
    spyLinks.forEach((l, i) => l.addEventListener('click', e => {
      e.preventDefault();
      if (!pinning) { const t = document.getElementById(l.dataset.target);
        if (t) window.scrollTo({ top: window.scrollY + t.getBoundingClientRect().top - 116, behavior: 'smooth' }); return; }
      const total = spyPin.offsetHeight - window.innerHeight;
      const pinTop = window.scrollY + spyPin.getBoundingClientRect().top;
      const target = pinTop + ((i + 0.5) / N) * total;
      window.scrollTo({ top: target, behavior: 'smooth' });
    }));

    window.addEventListener('scroll', () => requestAnimationFrame(spyScan), { passive: true });
    window.addEventListener('resize', () => { enablePin(); spyScan(); }, { passive: true });
    // React to the Tweaks "Scroll animations" toggle flipping .no-anim
    new MutationObserver(() => { enablePin(); spyScan(); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
    enablePin();
    spyScan();
  }
`;

const TWEAKS_JS = `
  const TWEAKS = /*EDITMODE-BEGIN*/{
    "audience": "everyone",
    "accent": "#836BA6",
    "animations": true
  }/*EDITMODE-END*/;

  // Audience-aware copy. innerHTML because some strings carry <br>/<em>.
  const COPY = {
    heroTitle: {
      everyone: 'Live classes that<br><em>remember</em><br>everything.',
      teachers: 'Teach live.<br><em>Let AI handle</em><br>the rest.',
      students: 'Never miss<br><em>a thing,</em><br>ever again.'
    },
    heroLede: {
      everyone: 'A live classroom, a shared whiteboard, and an AI that remembers every session â one calm place for teachers to teach and students to never miss a thing.',
      teachers: 'Your live classroom, your AI assistant, and your whole batch â in one calm place built for independent educators.',
      students: 'Join live, ask the AI anything you missed, and revise from every class â so you never fall behind, even if you join late or zone out.'
    },
    trustLine: {
      everyone: 'Everything a class needs â for teachers and students alike',
      teachers: 'Everything an independent educator needs â nothing they donât',
      students: 'Everything you need to keep up â and never miss a class'
    },
    featuresHead: {
      everyone: 'Classes run better<br><em>for everyone.</em>',
      teachers: 'Four reasons educators<br>move their whole batch <em>here.</em>',
      students: 'Four reasons students<br>never fall <em>behind here.</em>'
    },
    featD_h3: {
      everyone: 'One calm place for the whole class',
      teachers: 'A platform teachers actually enjoy',
      students: 'Your whole class, in one place'
    },
    featD_p: {
      everyone: 'Classes, notes, tests, and fees in one clean, fast place â teachers run the batch and students always know whatâs next, whatâs due, and where to revise.',
      teachers: 'Schedule classes, publish notes, run tests, manage students, and track fees â in one clean, fast, uncluttered place. No enterprise bloat, no clutter.',
      students: 'Notes, tests, schedules, and fees in one clean place â always know whatâs next, whatâs due, and where to find everything from class.'
    },
    ctaP: {
      everyone: 'Teach it, learn it, and never lose it â live classes that explain themselves, for everyone in the room.',
      teachers: 'Teach live, let AI capture and explain it all, and manage the entire batch â without leaving the room.',
      students: 'Show up, stay curious, and let AI catch the rest â revise any class, any doubt, anytime.'
    }
  };

  function persist(edits) {
    Object.assign(TWEAKS, edits);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  }
  function applyAudience(mode) {
    for (const id in COPY) { const el = document.getElementById(id); if (el) el.innerHTML = COPY[id][mode]; }
    document.querySelectorAll('#segAudience button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === mode)));
  }
  function applyAccent(hex) {
    let s = document.getElementById('accentStyle');
    if (!s) { s = document.createElement('style'); s.id = 'accentStyle'; document.head.appendChild(s); }
    s.textContent = ':root{--accent-green:' + hex + ';}'
      + '.btn-primary{background:' + hex + ' !important;border-color:' + hex + ' !important;}'
      + '#tweaks .switch[aria-pressed="true"]{background:' + hex + ' !important;}';
    document.querySelectorAll('#swAccent .sw').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === hex)));
  }
  function applyAnimations(on) {
    document.body.classList.toggle('no-anim', !on);
    document.getElementById('tkAnim').setAttribute('aria-pressed', String(on));
  }

  // Apply persisted defaults on load
  applyAudience(TWEAKS.audience);
  applyAccent(TWEAKS.accent);
  applyAnimations(TWEAKS.animations);

  // Wire controls
  document.getElementById('segAudience').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    applyAudience(b.dataset.v); persist({ audience: b.dataset.v });
  });
  document.getElementById('swAccent').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    applyAccent(b.dataset.v); persist({ accent: b.dataset.v });
  });
  document.getElementById('tkAnim').addEventListener('click', () => {
    const on = !(TWEAKS.animations); applyAnimations(on); persist({ animations: on });
  });

  // Tweaks host protocol â register listener BEFORE announcing availability
  const panel = document.getElementById('tweaks');
  window.addEventListener('message', e => {
    const t = e.data && e.data.type;
    if (t === '__activate_edit_mode') panel.classList.add('open');
    else if (t === '__deactivate_edit_mode') panel.classList.remove('open');
  });
  document.getElementById('tkClose').addEventListener('click', () => {
    panel.classList.remove('open');
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
`;

export function LandingPage() {
  useEffect(() => {
    // Load Lucide icons then run page scripts
    const script = document.createElement("script");
    script.src = "/og-landing/c11c6e72-1b9f-4ccc-aa73-0c8bbc246203.js";
    script.onload = () => {
      // Wire auth buttons
      document.querySelectorAll("[data-og-signin]").forEach((el) => {
        el.addEventListener("click", () =>
          signIn("google", { callbackUrl: "/welcome" })
        );
      });
      // Run page logic
      const s1 = document.createElement("script");
      s1.textContent = MAIN_JS;
      document.body.appendChild(s1);
      const s2 = document.createElement("script");
      s2.textContent = TWEAKS_JS;
      document.body.appendChild(s2);
    };
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />
    </>
  );
}
