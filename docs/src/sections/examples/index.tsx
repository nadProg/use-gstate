import { Section } from '../../components/ui/section';
import { CounterExample } from './counter';
import { TodoListExample } from './todo-list';
import { FormExample } from './form';
import { SelectorPatternExample } from './selector';
import { ReactQueryIntegrationExample } from './react-query';
import { ReducerPatternExample } from './reducer';

export function Examples() {
  return (
    <Section id="examples" title="Examples">
      <CounterExample />
      <TodoListExample />
      <SelectorPatternExample />
      <ReducerPatternExample />
      <FormExample />
      <ReactQueryIntegrationExample />
    </Section>
  );
}
