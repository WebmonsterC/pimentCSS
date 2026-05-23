/** Shared suggestion data for autocomplete docs and behavior. */

export type AutocompleteSuggestion = {
  name: string;
  role: string;
};

export const AUTOCOMPLETE_PEOPLE: AutocompleteSuggestion[] = [
  { name: 'Camille Dupont', role: 'Directrice financière' },
  { name: 'Lucas Martin', role: 'Chef de produit' },
  { name: 'Sofia Nguyen', role: 'Ingénieure accessibilité' },
  { name: 'Amine El Karoui', role: 'Responsable support client' },
  { name: 'Élise Bernard', role: 'Designer système' },
  { name: 'Thomas Weber', role: 'Architecte technique' },
];

export function suggestionHaystack(s: AutocompleteSuggestion): string {
  return `${s.name} ${s.role}`.toLowerCase();
}
