<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'shippingMethod' => $this->whenLoaded('shippingMethod', fn () => new ShippingMethodResource($this->shippingMethod)),
            'items' => $this->whenLoaded('items', fn () => OrderItemResource::collection($this->items)),
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'guest_name' => $this->guest_name,
            'guest_email' => $this->guest_email,
            'guest_phone' => $this->guest_phone,
            'session_id' => $this->session_id,
            'shipping_address' => $this->shipping_address,
            'billing_address' => $this->billing_address,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
