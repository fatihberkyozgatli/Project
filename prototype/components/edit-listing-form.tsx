"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  type Listing,
  type Nonprofit,
} from "@/types";

export function EditListingForm({
  listing,
  nonprofits,
}: {
  listing: Listing;
  nonprofits: Nonprofit[];
}) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Card className="p-6">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/listings/${listing.id}`);
        }}
      >
        <Field label="Title">
          <Input defaultValue={listing.title} />
        </Field>
        <Field label="Description">
          <Textarea defaultValue={listing.description} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <Select defaultValue={listing.category}>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Price (USD)">
            <Input defaultValue={(listing.priceCents / 100).toString()} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Condition">
            <Select defaultValue={listing.condition}>
              {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Pickup area">
            <Input defaultValue={listing.pickupArea} />
          </Field>
        </div>
        <Field label="Nonprofit">
          <Select defaultValue={listing.nonprofitId}>
            {nonprofits.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex items-center justify-between border-t border-sand-200 pt-5">
          <Button
            type="button"
            variant="ghost"
            className="text-error hover:bg-error-subtle"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this listing?"
      >
        <p className="text-sm text-sand-600">
          This can&apos;t be undone. The listing will be removed from the
          marketplace.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Keep listing
          </Button>
          <Button variant="destructive" onClick={() => router.push("/profile")}>
            Delete listing
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
