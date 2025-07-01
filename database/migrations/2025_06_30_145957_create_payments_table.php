<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_id');
            $table->string('phone');
            $table->string('mpesa_receipt')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->foreign('request_id')->references('id')->on('ewaste_requests')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
