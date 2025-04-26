import { CreateGStoreSection } from './create-gstore';
import { SelectorsSection } from './selectors';
import { MethodsSection } from './methods';
import { Section } from '../../components/ui/section';

export function ApiReference() {
  return (
    <Section id="api-reference" title="API Reference">
      <CreateGStoreSection />
      <SelectorsSection />
      <MethodsSection />
    </Section>
  );
}
