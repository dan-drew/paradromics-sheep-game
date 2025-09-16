// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import type {Dimensions} from './dimensions';

export const URL_PARAMS = new URLSearchParams(window.location.search);

// TODO(salg): Use preprocessor to filter IOS code at build time.
export const IS_IOS: boolean = /CriOS/.test(window.navigator.userAgent);

export const IS_HIDPI: boolean = true // window.devicePixelRatio > 1;

export const IS_ANDROID = /Android/.test(window.navigator.userAgent)
export const IS_MOBILE_TEST = URL_PARAMS.get('mobile') === '1';
export const IS_MOBILE: boolean = IS_MOBILE_TEST || IS_IOS || IS_ANDROID

export const IS_RTL: boolean = document.documentElement.dir === 'rtl';

export const IS_EXPERIMENTAL = URL_PARAMS.get('experimental') === '1';

// Frames per second.
export const FPS: number = 60;

export const DEFAULT_DIMENSIONS: Dimensions = {
  width: 600,
  height: 150,
};
