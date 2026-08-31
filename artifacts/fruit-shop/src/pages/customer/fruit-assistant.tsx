import { useState } from 'react';
import { ArrowRight, Loader2, Sparkles, Leaf, MessageSquareText, ShieldCheck, RefreshCw, Bot, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomerLayout } from '@/components/layout/customer-layout';
import { ProductCard } from '@/components/ui/product-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Product } from '@workspace/api-client-react';

type AssistantFruit = {
  name: string;
  naturalSugar: string;
  waterContent: string;
  benefits: string[];
  generalInfo: string;
};

type AssistantResponse = {
  answer: string;
  intent: string;
  fruits: AssistantFruit[];
  products: Product[];
  disclaimer: string;
  question: string;
};

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant' | 'error';
  text: string;
  response?: AssistantResponse;
};

const exampleQuestions = [
  'Low sugar fruits',
  'Which fruits are good for hydration?',
  'I have fever, which fruits are generally suitable?',
  'Which fruits have potassium?',
  'Compare banana and apple',
];

export default function FruitAssistantPage() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState('');

  const askAssistant = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Please enter a question first.');
      return;
    }

    setLastQuestion(trimmed);
    setIsLoading(true);
    setError(null);
    setConversation((current) => [...current, { id: Date.now(), role: 'user', text: trimmed }]);

    try {
      const assistantUrl = new URL('/api/fruit-assistant', 'https://smart-inventory-stock-management-system.onrender.com').toString();

      const res = await fetch(assistantUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      const rawText = await res.text();
      let payload: any = null;

      if (rawText) {
        try {
          payload = JSON.parse(rawText);
        } catch {
          throw new Error('The server returned an invalid JSON response.');
        }
      }

      if (!res.ok) {
        throw new Error(payload?.error || payload?.message || 'Unable to get a response.');
      }

      if (!payload) {
        throw new Error('The server returned an empty response.');
      }

      const assistantResponse = payload as AssistantResponse;
      setResponse(assistantResponse);
      setConversation((current) => [
        ...current,
        { id: Date.now() + 1, role: 'assistant', text: assistantResponse.answer, response: assistantResponse },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
      setConversation((current) => [
        ...current,
        { id: Date.now() + 1, role: 'error', text: message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    askAssistant(question);
    setQuestion('');
  };

  const visibleResponse = response;

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-6 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-[28px] border border-border/80 bg-card p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary">
                  <Leaf className="h-4 w-4" />
                  Fruit Assistant
                </div>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.8rem]">
                  Ask about fruits,
                  <span className="text-primary"> nutrition and stock</span>
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Get quick guidance on sugar, fiber, hydration, fruit comparisons, pricing, availability and organic choices based on our fruit knowledge and current inventory.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                Live store insights
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-border/80 bg-card p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask a fruit question…"
                  className="h-12 rounded-2xl border-muted bg-background text-base shadow-none focus-visible:ring-primary/40"
                />
              </div>
              <Button type="submit" className="h-12 rounded-2xl px-5 sm:px-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    Ask assistant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {exampleQuestions.map((example) => (
                <Button
                  key={example}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
                  onClick={() => {
                    setQuestion(example);
                    askAssistant(example);
                  }}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border/80 bg-card p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-4 lg:p-5">
            {!conversation.length && !isLoading && (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-background/50 p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                  <Bot className="h-8 w-8" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Fruit Assistant</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                  Ask about fruit nutrition, sugar levels, hydration, fiber, stock, or fruit comparisons.
                </p>
              </div>
            )}

            {conversation.length > 0 && (
              <div className="space-y-4">
                {conversation.map((message) => {
                  const isUser = message.role === 'user';
                  const isAssistant = message.role === 'assistant';
                  const isError = message.role === 'error';

                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'} transition-all duration-200`}
                    >
                      {!isUser && (
                        <Avatar className="h-9 w-9 border border-primary/20 bg-primary/10 text-primary shadow-sm">
                          <AvatarFallback className="bg-transparent text-primary">
                            <Leaf className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {isUser && (
                        <Avatar className="h-9 w-9 border border-border bg-muted text-foreground">
                          <AvatarFallback className="bg-transparent text-foreground">
                            <UserRound className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`max-w-[86%] ${isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={[
                            'rounded-[22px] border px-4 py-3 text-sm shadow-sm sm:text-base',
                            isUser && 'bg-primary text-primary-foreground border-primary',
                            isAssistant && 'border-border bg-background/80 text-foreground',
                            isError && 'border-destructive/30 bg-destructive/5 text-destructive',
                          ].join(' ')}
                        >
                          {isError ? (
                            <div className="space-y-3">
                              <p>{message.text}</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-full border-destructive/30 bg-background text-destructive hover:bg-destructive/5"
                                onClick={() => {
                                  if (lastQuestion) askAssistant(lastQuestion);
                                }}
                              >
                                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                Retry
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="leading-7">{message.text}</p>

                              {isAssistant && message.response && (
                                <>
                                  {message.response.fruits?.length > 0 && (
                                    <div className="space-y-2 pt-1">
                                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                        Matching fruits
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {message.response.fruits.map((fruit) => (
                                          <span
                                            key={fruit.name}
                                            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                                          >
                                            {fruit.name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                                    <div className="mb-1.5 flex items-center gap-2 font-semibold">
                                      <ShieldCheck className="h-3.5 w-3.5" />
                                      Nutrition disclaimer
                                    </div>
                                    {message.response.disclaimer}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-end gap-3 justify-start">
                    <Avatar className="h-9 w-9 border border-primary/20 bg-primary/10 text-primary shadow-sm">
                      <AvatarFallback className="bg-transparent text-primary">
                        <Leaf className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="max-w-[86%] rounded-[22px] border border-border bg-background/80 px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>Thinking about the best fruit suggestions…</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {visibleResponse && visibleResponse.products?.length > 0 && (
              <div className="mt-6 space-y-5 border-t border-border pt-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <MessageSquareText className="h-4 w-4 text-primary" />
                    Suggested products
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {visibleResponse.products.length} results
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {visibleResponse.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {error && !isLoading && !conversation.length && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <RefreshCw className="h-4 w-4" />
                  Something went wrong
                </div>
                <p>{error}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-full border-destructive/30 bg-background text-destructive hover:bg-destructive/5"
                  onClick={() => {
                    if (lastQuestion) askAssistant(lastQuestion);
                  }}
                >
                  Try again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
