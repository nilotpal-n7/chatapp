// src/models/qrToken.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface QRToken extends Document {
  tokenId: string;
  userId: string;
  expiry: Date;
}

const QRTokenSchema = new Schema<QRToken>({
  tokenId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  expiry: { type: Date, required: true },
});

const QRTokenModel = (mongoose.models.QRToken) as mongoose.Model<QRToken> || (mongoose.model<QRToken>('QRToken', QRTokenSchema))
export default QRTokenModel
