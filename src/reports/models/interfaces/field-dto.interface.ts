import { type Field } from '../field.entity'

export interface FieldDto extends Pick<Field, 'name' | 'placeholder' | 'active' | 'type'> {
}
