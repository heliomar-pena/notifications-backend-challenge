import { CreateTemplateDto } from 'src/email-templates/dto/create-template.dto';

export class TemplateDetailsResponseDTO extends CreateTemplateDto {
  id: string;
  status: string;
}
