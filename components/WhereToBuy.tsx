import Container from "./Container";
import InquiryForm from "./InquiryForm";

export default function WhereToBuy() {
  return (
    <section id="buy" className="bg-aqua-deep pb-28 text-white">
      <Container>
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <p className="font-display text-sm font-semibold text-lemon">
              Where to buy
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-[2.75rem]">
              Get a bottle of Aqua Spark.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
              Aqua Spark is sold locally in 250ml bottles — for home kitchens
              and for shops that want to stock it. Leave your details and
              we&apos;ll follow up to arrange yours.
            </p>

            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="font-display font-semibold">Bottle size</dt>
                <dd className="mt-1 text-white/70">250ml, screw-top pour cap</dd>
              </div>
              <div>
                <dt className="font-display font-semibold">Bulk orders</dt>
                <dd className="mt-1 text-white/70">
                  Available for shops and households
                </dd>
              </div>
            </dl>
          </div>

          <InquiryForm />
        </div>
      </Container>
    </section>
  );
}
