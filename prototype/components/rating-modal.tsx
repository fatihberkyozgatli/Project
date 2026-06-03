"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function RatingModal({ otherName }: { otherName: string }) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-charity-text hover:bg-white/90"
      >
        <Star className="h-4 w-4" aria-hidden="true" />
        Rate {otherName}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={done ? "Thanks for the feedback" : `Rate ${otherName}`}
      >
        {done ? (
          <div className="py-4 text-center">
            <p className="text-sm text-sand-600">
              Your rating helps keep the community trustworthy.
            </p>
            <Button className="mt-5" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} stars`}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setScore(n)}
                >
                  <Star
                    className={cn(
                      "h-9 w-9 transition-colors",
                      (hover || score) >= n
                        ? "fill-warning text-warning"
                        : "text-sand-300",
                    )}
                  />
                </button>
              ))}
            </div>
            <Field label="Comment" hint="Optional">
              <Textarea placeholder="How was the handoff?" />
            </Field>
            <Button type="submit" className="w-full" disabled={score === 0}>
              Submit rating
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
