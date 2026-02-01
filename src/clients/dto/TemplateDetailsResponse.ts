import { CreateTemplateDto } from 'src/email-templates/dto/create-template.dto';

export class TemplateDetailsResponse extends CreateTemplateDto {
  id: string;
  status: string;
}
