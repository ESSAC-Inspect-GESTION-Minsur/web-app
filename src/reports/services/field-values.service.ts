import { AppServices } from '@/shared/service/app-api.service'

export class FieldValuesService extends AppServices {
  constructor () {
    super({ baseUrl: 'field-values', contentType: 'application/json' })
  }
}
