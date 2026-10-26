// Rspress's built-in search groups its hits, and lists a page twice when its title and its
// content both match (for example "Research" and "Research. Vulnerabilities…"). This hook
// keeps one hit per page, preferring the content hit, because it carries the excerpt.
//
// It only removes hits; it does not change the query. Rewriting the query is not safe here:
// Rspress compares the input box with the rewritten query and then drops the results.

type Hit = { link?: string; type?: string };
type Group = { result?: Hit[] };

const pageOf = (link: string | undefined) => (link ?? '').split('#')[0];

export function afterSearch(_query: string, groups: Group[]): void {
  if (!Array.isArray(groups)) return;

  const hits = groups.flatMap((group) =>
    Array.isArray(group.result) ? group.result : [],
  );
  const pagesWithContent = new Set(
    hits.filter((hit) => hit.type === 'content').map((hit) => pageOf(hit.link)),
  );

  const seenContent = new Set<string>();
  const keep = new Set<Hit>();
  for (const hit of hits) {
    const page = pageOf(hit.link);
    if (hit.type === 'content') {
      if (!seenContent.has(page)) {
        seenContent.add(page);
        keep.add(hit);
      }
    } else if (!pagesWithContent.has(page)) {
      keep.add(hit);
    }
  }

  for (const group of groups) {
    if (Array.isArray(group.result)) {
      group.result = group.result.filter((hit) => keep.has(hit));
    }
  }
}
