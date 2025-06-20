<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EwasteRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'consumer_id',
        'recycler_id', // Nullable, set when recycler accepts the job
        'type',
        'quantity',
        'location',
        'description',
        'status',
    ];

    //  Relationship to get the consumer (user who submitted the request)
    public function consumer()
    {
        return $this->belongsTo(User::class, 'consumer_id');
    }

    //  Relationship to get the recycler (user who accepted the job)
    public function recycler()
    {
        return $this->belongsTo(User::class, 'recycler_id');
    }
}

