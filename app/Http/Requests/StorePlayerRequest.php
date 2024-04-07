<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlayerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'ts_code' => 'required|string',
            'tournament_rule_requirements' => 'array',
            'tournament_rule_requirements.allowDecline' => 'boolean',
            'tournament_rule_requirements.revealOpponent' => 'boolean',
            'tournament_rule_requirements.revealPreviousMatches' => 'boolean',
        ];
    }
}
