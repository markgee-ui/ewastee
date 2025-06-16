<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
// This migration creates a notifications table with the following fields:
// - id: Primary key
// - user_id: Foreign key referencing the users table, with a cascade delete on user deletion
// - message: String field for the notification message
// - is_read: Boolean field to indicate if the notification has been read, defaulting to false
// - timestamps: Automatically managed created_at and updated_at fields
// The up method defines the structure of the notifications table, while the down method ensures that the table is dropped if the migration is rolled back.
// This migration is essential for managing user notifications in the application, allowing users to receive and track notifications related to their e-waste requests and other activities.
// The notifications table will help in keeping users informed about important updates, such as request status changes or system alerts.    