// Contactgegevens die (nog) niet zijn aangeleverd. Leeg laten totdat er
// een echt nummer/adres bekend is — nooit een placeholder-nummer
// invullen, want dat zou een niet-bestaand WhatsApp-contact suggereren.
// Zodra Gijs een echt WhatsApp-zakelijk nummer aanlevert, vul je het hier
// in als internationaal formaat zonder "+", bv. "31612345678".
export const WHATSAPP_NUMMER = "";
export const CONTACT = {
  street: "Demmersweg 9 - 11",
  city: "7556 BN, Hengelo",
  email: "info@groeninjestraat.nl",
  phone: "074 - 234 0 777",
  phoneHref: "tel:+31742340777",
  // TODO: KvK-nummer van Gijs nog laten bevestigen. Staat nergens in het
  // aangeleverde materiaal, dus bewust leeg: de footer toont de KvK-regel
  // pas zodra hier een bevestigd nummer staat. Nooit een nummer gokken.
  kvk: "",
};
