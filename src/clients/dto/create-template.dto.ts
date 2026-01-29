export class TemplateVariable {
  key: string;
  type: string;
  fallbackValue: string;
}

export class CreateTemplateDto {
  name: string;
  html: string;
  variables: TemplateVariable[];
}
