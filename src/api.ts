const FFX_FANDOM_API_URL = 'https://finalfantasyx.fandom.com/fr/api.php';
const FF_FANDOM_API_URL = 'https://finalfantasy.fandom.com/fr/api.php';

// Paramètres de la requête
const DEFAULT_PARAMS = {
  action: 'query',
  prop: 'revisions',
  titles: 'Bestiaires',
  rvprop: 'content',
  format: 'json',
};

export async function getBestiaryFromFandom(): Promise<String> {
  const params = {
    ...DEFAULT_PARAMS,
    action: 'query',
    prop: 'revisions',
    titles: 'Liste_des_ennemis_de_Final_Fantasy_X',
    rvprop: 'content',
  };

  const urlWithParams = FF_FANDOM_API_URL + '?' + new URLSearchParams(params);

  const reponse = await fetch(urlWithParams);
  const { query } = await reponse.json();
  const keys = Object.keys(query.pages);
  return query.pages[keys[0]].revisions[0]['*'];
}
