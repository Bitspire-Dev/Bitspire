export default function NotFound() {
  return (
    <section className="container mx-auto flex max-w-360 flex-col items-center justify-center px-4 py-24 text-center md:px-6 md:py-32">
      <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        404 — Strona nie została znaleziona
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
        Nie mogliśmy odnaleźć strony, której szukasz. Sprawdź adres lub wróć na stronę główną.
      </p>
    </section>
  );
}
