import Reveal from '../Reveal';
import Backdrop, { Glow } from '../ui/Backdrop';
import Button from '../ui/Button';
import { ArrowRightIcon } from '../icons';

/** Dark "Let's talk" band that closes the homepage. */
export default function CallToAction() {
  return (
    <Reveal>
      <div className="relative isolate overflow-hidden rounded-[20px] bg-band px-6 py-12 text-center text-white sm:px-12 sm:py-16 dark:border dark:border-line">
        <Backdrop fade="center" />
        <Glow className="-bottom-60 left-1/2 size-130 -translate-x-1/2" />
        <p className="mb-3 font-mono text-sm font-bold text-accent">// contact</p>
        <h2 className="mx-auto mb-4 max-w-xl text-[clamp(1.8rem,4vw,2.6rem)] leading-tight font-extrabold tracking-tight text-balance">
          Have an idea or a challenge? Let&rsquo;s talk about it.
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-white/72">
          Tell us what you want to build. We&rsquo;ll think it through with you first, then build it.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/contact" size="lg">
            Get in touch <ArrowRightIcon size={18} strokeWidth={2.5} />
          </Button>
          <Button to="/about" size="lg" variant="ghost">
            About us
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
