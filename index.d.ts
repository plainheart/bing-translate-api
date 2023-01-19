import type { Agents } from "got";

export declare function translate(
  text: string,
  from: string,
  to: string,
  correct?: boolean,
  raw?: boolean,
  userAgent?: string,
  proxyAgents?: Agents
): Promise<{
  text: string;
  userLang: string;
  translation: string;
  language: {
    from: string;
    to: string;
    score: number;
  };
}>;
