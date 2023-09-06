const mapping: Record<string, string> = {
  companies: 'company',
  'delivery-items': 'delivery_item',
  'delivery-notes': 'delivery_note',
  'excel-imports': 'excel_import',
  'invalid-notes': 'invalid_note',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
