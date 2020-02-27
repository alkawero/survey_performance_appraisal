<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Setting;

class SettingController extends Controller
{
    public function getByParams(Request $request){
        $query = Setting::when($request->indicator, function ($query) use ($request) {
            return $query->where('indicator', $request->indicator);
        })
        ;
        if($request->rowsPerPage)
        return $query->paginate($request->rowsPerPage);
        else
        return $query->get();


    }

    public function getValue(Request $request){
        $value = Setting::where('indicator', $request->indicator)->value('value');
        return $value;
    }

    public function store(Request $request)
    {
        $setting = new Setting();
        $setting->indicator = $request->indicator;
        $setting->value = $request->value;
        $setting->created_by = $request->created_by;
        $setting->save();
    }

    public function update(Request $request)
    {
        foreach ($request->settings as $s) {
            $setting = Setting::where('indicator',$s['indicator'])->first();
            $value = $s['value'];
            $setting->value = strval($value);
            $setting->updated_by = $request['updated_by'];
            $setting->save();
        }

    }
}
