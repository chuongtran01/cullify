import { ImagePlus } from "lucide-react";

import { ButtonLink } from "@/components/landing/button-link";

export function FinalCtaSection() {
  return (
    <section className="border-y border-hairline bg-surface-card">
      <div className="mx-auto flex max-w-[900px] flex-col items-center px-5 py-24 text-center">
        <h2 className="text-[36px] font-normal leading-[1.2] text-ink">
          Stop manually sorting thousands of photos.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-body">
          Upload a batch, let Cullify find the strongest frames, and leave
          review with a clean set of keepers.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink variant="primary">
            <ImagePlus className="size-4" />
            Upload Photos
          </ButtonLink>
          <ButtonLink variant="secondary">Try Demo</ButtonLink>
        </div>
      </div>
    </section>
  );
}
