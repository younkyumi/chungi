// ━━━ 한자 corpus 로더 (5,978자 정적 데이터) ━━━
// public/hanja-corpus.json을 첫 진입 시 1회 fetch → 인메모리 캐싱
// 이후 모든 검색은 캐시에서 (네트워크 없음, 빠름)

import type { HanjaItem } from "./hanja-extended";

let cache: HanjaItem[] | null = null;
let promise: Promise<HanjaItem[]> | null = null;
let cacheByStroke: Record<number, HanjaItem[]> | null = null;

export function getHanjaCorpus(): HanjaItem[] {
  return cache || [];
}

export function getHanjaByStroke(stroke: number): HanjaItem[] {
  if (!cacheByStroke && cache) {
    cacheByStroke = {};
    for (const h of cache) {
      if (!cacheByStroke[h.s]) cacheByStroke[h.s] = [];
      cacheByStroke[h.s].push(h);
    }
  }
  return cacheByStroke?.[stroke] || [];
}

export function loadHanjaCorpus(): Promise<HanjaItem[]> {
  if (cache) return Promise.resolve(cache);
  if (promise) return promise;
  promise = fetch('/hanja-corpus.json')
    .then(r => r.json())
    .then((data: HanjaItem[]) => {
      cache = data;
      cacheByStroke = null; // 다음 호출 시 재계산
      return data;
    })
    .catch(() => {
      cache = [];
      return [];
    });
  return promise;
}
