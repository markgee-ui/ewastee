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
    Schema::table('payments', function ($table) {
        $table->string('checkout_request_id')->nullable()->after('status');
    });
}

public function down()
{
    Schema::table('payments', function ($table) {
        $table->dropColumn('checkout_request_id');
    });
}

};
