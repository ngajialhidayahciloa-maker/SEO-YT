export interface TitleOption {
  title: string;
  characterCount: number;
  type: string;
  matchedTag: string;
}

export interface Chapter {
  time: string;
  title: string;
}

export interface DescriptionData {
  firstTwoLines: string;
  synopsis: string;
  chapters: Chapter[];
  linksSection: string;
  hashtags: string[];
  fullDescriptionFormatted: string;
}

export interface TagItem {
  tag: string;
  score: number;
  category: string;
}

export interface TagsData {
  tagList: TagItem[];
  commaSeparatedString: string;
  totalLength: number;
}

export interface StrategyInsights {
  thumbnailIdea: string;
  thumbnailText: string;
  storyHookOpening: string;
  retentionAdvice: string;
  searchIntentType?: string;
  whyThisRankNotRandom?: string;
}

export interface GoldenTriangleAudit {
  primaryKeyword: string;
  inTitle: boolean;
  inDescriptionFirstTwoLines: boolean;
  inTags: boolean;
  triangleScore: number; // 0 - 100%
  statusMessage: string;
}

export interface GeneratedSEOResult {
  focusKeywords: string[];
  titles: TitleOption[];
  primaryTitleIndex: number;
  description: DescriptionData;
  tags: TagsData;
  checklistAudit: {
    titleLengthStatus: string;
    descriptionLengthStatus: string;
    tagsLengthStatus: string;
    tagInTitleStatus: string;
    tagInDescriptionStatus: string;
    linksInDescriptionStatus: string;
    hashtagsStatus: string;
    estimatedVidIqScore: number;
  };
  strategyInsights: StrategyInsights;
  goldenTriangle?: GoldenTriangleAudit;
}

export interface CompetitorAnalysisResult {
  competitorScoreSummary: string;
  titleBreakdown: {
    characters: number;
    clickTriggers: string[];
    strengths: string;
    weaknesses: string;
  };
  estimatedTagsUsed: string[];
  contentGaps: string[];
  howToBeatStrategy: {
    betterTitleSuggestions: string[];
    thumbnailCounterAngle: string;
    firstMinuteHook: string;
    suggestedVideoHijackTip: string;
  };
}

export type ChecklistStatus = 'pass' | 'fail' | 'neutral';

export interface ChecklistItemAudit {
  id: string;
  title: string;
  statValue?: string;
  status: ChecklistStatus;
  description: string;
  tip?: string;
  actionableHelp?: string;
}
