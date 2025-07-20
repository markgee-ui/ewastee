<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ewaste_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consumer_id')->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->integer('quantity');
            $table->string('location');
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'accepted', 'in_progress', 'completed'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ewaste_requests');
    }
};
// This migration creates the ewaste_requests table with the necessary fields and relationships.
// It includes a foreign key constraint to the users table for the consumer_id field.
// The table tracks the type of e-waste, quantity, pickup location, description, and status of the request.
// The status can be 'pending', 'accepted', or 'completed', with 'pending' as the default value.
// The timestamps will automatically manage created_at and updated_at fields.
// This migration is essential for managing e-waste requests in the application, allowing consumers to request pickups for their e-waste items.
// The down method ensures that the table is dropped if the migration is rolled back, maintaining database integrity.
// This migration is essential for managing e-waste requests in the application, allowing consumers to request pickups for their e-waste items.
// The down method ensures that the table is dropped if the migration is rolled back, maintaining database integrity.
// This migration is essential for managing e-waste requests in the application, allowing consumers to request pickups for their e-waste items.
// The down method ensures that the table is dropped if the migration is rolled back, maintaining database integrity.
// This migration is essential for managing e-waste requests in the application, allowing consumers to request pickups for their e-waste items.
// The down method ensures that the table is dropped if the migration is rolled back, maintaining database integrity.
// This migration is essential for managing e-waste requests in the application, allowing consumers to request pickups for their e-waste items. 