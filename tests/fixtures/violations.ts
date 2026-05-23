export type ViolationType =
  | 'touch-target'
  | 'horizontal-overflow'
  | 'font-size-input'
  | 'component-missing';

export type TouchTargetViolation = {
  tag: string;
  className: string;
  width: number;
  height: number;
  label: string;
};

export type Violation = {
  type: ViolationType;
  pagePath: string;
  project: string;
  touchTargets?: TouchTargetViolation[];
  fontSizeInputs?: string[];
  componentSelector?: string;
};
