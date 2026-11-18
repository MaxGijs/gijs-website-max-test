import { ViewTransition, cloneElement, type CSSProperties, type ReactElement } from "react";

/**
 * Foto die bij doorklikken van kaart naar pagina meeschuift (zie lib/overgang.ts).
 *
 * Twee lagen, allebei nodig:
 * - De React-<ViewTransition>: React start alleen een view transition als er zo'n component in de
 *   pagina zit. Zonder deze wrapper gebeurt er dus helemaal niets.
 * - Een vaste CSS-overgangsnaam op de foto zelf: React koppelt het paar alleen als beide foto's
 *   op dat moment in beeld zijn, en meet de nieuwe pagina nog op de oude scrollpositie. Bij een
 *   kaart lager op de pagina viel de foto daardoor weg; met deze naam koppelt de browser hem zelf.
 *
 * Het kind moet één DOM-element zijn (de fotocontainer).
 */
export function FotoOvergang({ id, children }: { id: string; children: ReactElement<{ style?: CSSProperties }> }) {
  const naam = "foto-" + id;
  const kind = cloneElement(children, {
    style: { ...children.props.style, viewTransitionName: naam, viewTransitionClass: "foto-overgang" } as CSSProperties,
  });
  return <ViewTransition name={naam} share="foto-overgang" default="none">{kind}</ViewTransition>;
}
