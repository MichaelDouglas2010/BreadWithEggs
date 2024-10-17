// models/index.ts
import { Schema, model, Document } from 'mongoose';

// Interface para definir os tipos do modelo
interface IItem extends Document {
  name: string;
  price: number;
}

// Definir o schema
const ItemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Criar o modelo
const Item = model<IItem>('Item', ItemSchema);

export default Item;

