<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up()
{
    Schema::create('reward_redemptions', function ($table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->integer('points_redeemed');
        $table->decimal('amount', 10, 2);
        $table->string('status')->default('pending'); // pending, paid, failed
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('reward_redemptions');
}
};
