import { getProducts, getCollections } from '@/lib/shopify';
import SearchClient from './SearchClient';

export const metadata = { title: 'Search — TONET' };

// Levenshtein Distance Calculator
function getLevenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  return dp[m][n];
}

// Checks if a term fuzzy-matches a target word based on word length thresholds (typo tolerance)
function isFuzzyMatch(term: string, target: string): boolean {
  if (term.length <= 2) {
    return target.startsWith(term);
  }
  const maxDistance = term.length <= 4 ? 1 : term.length <= 7 ? 2 : 3;
  const distance = getLevenshteinDistance(term, target);
  return distance <= maxDistance;
}

// Scores a product based on how well it matches the search terms (relevance sorting)
function scoreProduct(product: any, queryTerms: string[]): number {
  let score = 0;
  let termsMatched = 0;

  const titleWords = product.title.toLowerCase().split(/\s+/);
  const descWords = product.description ? product.description.toLowerCase().split(/\s+/) : [];
  const tags = product.tags ? product.tags.map((t: string) => t.toLowerCase()) : [];

  for (const term of queryTerms) {
    let termMatched = false;
    let maxTermScore = 0;

    // 1. Check Title
    for (const word of titleWords) {
      if (word === term) {
        maxTermScore = Math.max(maxTermScore, 100);
        termMatched = true;
      } else if (word.startsWith(term)) {
        maxTermScore = Math.max(maxTermScore, 70);
        termMatched = true;
      } else if (word.includes(term)) {
        maxTermScore = Math.max(maxTermScore, 50);
        termMatched = true;
      } else if (isFuzzyMatch(term, word)) {
        maxTermScore = Math.max(maxTermScore, 40);
        termMatched = true;
      }
    }

    // 2. Check Tags
    for (const tag of tags) {
      if (tag === term) {
        maxTermScore = Math.max(maxTermScore, 60);
        termMatched = true;
      } else if (tag.includes(term)) {
        maxTermScore = Math.max(maxTermScore, 40);
        termMatched = true;
      } else if (isFuzzyMatch(term, tag)) {
        maxTermScore = Math.max(maxTermScore, 30);
        termMatched = true;
      }
    }

    // 3. Check Variants
    if (product.variants) {
      for (const variant of product.variants) {
        const vTitle = variant.title.toLowerCase();
        if (vTitle.includes(term)) {
          maxTermScore = Math.max(maxTermScore, 30);
          termMatched = true;
        }
        if (variant.selectedOptions) {
          for (const opt of variant.selectedOptions) {
            const optVal = opt.value.toLowerCase();
            if (optVal === term) {
              maxTermScore = Math.max(maxTermScore, 40);
              termMatched = true;
            } else if (optVal.includes(term)) {
              maxTermScore = Math.max(maxTermScore, 25);
              termMatched = true;
            }
          }
        }
      }
    }

    // 4. Check Description
    for (const word of descWords) {
      if (word === term) {
        maxTermScore = Math.max(maxTermScore, 20);
        termMatched = true;
      } else if (word.includes(term)) {
        maxTermScore = Math.max(maxTermScore, 10);
        termMatched = true;
      } else if (isFuzzyMatch(term, word)) {
        maxTermScore = Math.max(maxTermScore, 5);
        termMatched = true;
      }
    }

    score += maxTermScore;
    if (termMatched) {
      termsMatched++;
    }
  }

  // Multipliers and Penalties
  if (termsMatched === queryTerms.length) {
    score *= 1.5; // Perfect match multiplier
  } else if (termsMatched === 0) {
    score = 0;
  } else {
    // Penalize if some terms didn't match
    score *= (termsMatched / queryTerms.length);
  }

  return score;
}

// Scores a collection based on title match
function scoreCollection(collection: any, queryTerms: string[]): number {
  let score = 0;
  let termsMatched = 0;
  const titleWords = collection.title.toLowerCase().split(/\s+/);

  for (const term of queryTerms) {
    let termMatched = false;
    let maxTermScore = 0;

    for (const word of titleWords) {
      if (word === term) {
        maxTermScore = Math.max(maxTermScore, 100);
        termMatched = true;
      } else if (word.startsWith(term)) {
        maxTermScore = Math.max(maxTermScore, 75);
        termMatched = true;
      } else if (isFuzzyMatch(term, word)) {
        maxTermScore = Math.max(maxTermScore, 50);
        termMatched = true;
      }
    }

    score += maxTermScore;
    if (termMatched) termsMatched++;
  }

  if (termsMatched === queryTerms.length) {
    score *= 1.5;
  } else if (termsMatched === 0) {
    score = 0;
  } else {
    score *= (termsMatched / queryTerms.length);
  }

  return score;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const query = q.trim().toLowerCase();
  const queryTerms = query.split(/\s+/).filter(Boolean);

  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(50),
  ]);

  let matchedProducts: any[] = [];
  let matchedCollections: any[] = [];

  if (queryTerms.length > 0) {
    matchedProducts = products
      .map(p => ({ product: p, score: scoreProduct(p, queryTerms) }))
      .filter(item => item.score >= 15) // minimum threshold score to filter out irrelevant items
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);

    matchedCollections = collections
      .map(c => ({ collection: c, score: scoreCollection(c, queryTerms) }))
      .filter(item => item.score >= 15)
      .sort((a, b) => b.score - a.score)
      .map(item => item.collection);
  }

  return (
    <SearchClient
      query={q}
      products={matchedProducts}
      collections={matchedCollections}
    />
  );
}
