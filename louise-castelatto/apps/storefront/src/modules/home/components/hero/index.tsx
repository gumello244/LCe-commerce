import { Button, Heading } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-neutral-900 text-white">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6 bg-black/40">
        <span>
          <Heading
            level="h1"
            className="text-4xl sm:text-5xl leading-tight text-white font-serif font-light tracking-wide uppercase"
          >
            Louise Castelatto
          </Heading>
          <Heading
            level="h2"
            className="text-lg sm:text-xl leading-8 text-neutral-300 font-light mt-2 max-w-xl"
          >
            Elegância, estilo e sofisticação em cada detalhe.
          </Heading>
        </span>
        <LocalizedClientLink href="/store">
          <Button variant="secondary" className="px-8 py-3 bg-white text-black hover:bg-neutral-200 uppercase tracking-wider text-xs font-semibold">
            Explorar Coleção
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default Hero;
