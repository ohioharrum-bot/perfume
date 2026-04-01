import fragrances from '../../../data/fragrances';

export default function handler(req, res) {
  res.status(200).json(fragrances);
}