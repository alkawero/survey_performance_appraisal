<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Role;
use App\Unit;

class UserController extends Controller
{

    public function getDB(){
        if(config('app.env')==='LOCAL'){
            $database = env('DB_DATABASE','hris_survey');
        }elseif(config('app.env')==='DEV'){
            $database = env('DB_DATABASE_DEV','hris_survey');
        }elseif(config('app.env')==='PROD'){
            $database = env('DB_DATABASE_PROD','hris_survey');
        }

        return $database;
    }

    function login(Request $request){
        $user  = User::select('emp_id','emp_name','password','unit_id')
                        ->where('emp_id','=',$request->username)
                        ->where('emp_status','=',1)->first();
        if($user){
            if($user->password == sha1($request->password)){

                if($user->role()->first()){
                    $user->role = $user->role()->first()->name;
                }else{
                    $user->role = 'usr';
                }

                return $user;
            }
        }else{
            return null;
        }

    }

    function getUser($empId){
        $user  = User::find($empId);
        return sha1($user->password);
    }

    function getByName($name){
        //$users = User::select('emp_id','emp_name')->whereRaw('LOWER(`emp_name`) LIKE ? ',['%'.$name.'%'])->get();
        $users = User::select('emp_id','emp_name')->get();
        return $users;
    }

    function getAll(){
        $users = User::select('emp_id','emp_name')->where('emp_status',1)->get();
        return $users;
    }

    function getByUnit($unitId){
        $users = User::select('emp_id','emp_name')
                        ->where('emp_status',1)
                        ->where('unit_id',$unitId)->get();
        return $users;
    }

    function getUserLeader(Request $request){
        $keyIds = Unit::where('unit_under_id',$request->under_departement)->pluck('report_to_id')->toArray();
        $users = User::select('emp_id','emp_name')
                        ->where('emp_id','<>','admin_pa')
                        ->where('emp_status',1)
                        ->whereIn('key_id',$keyIds)->get();
        return $users;
    }

    function getUserAdmins(){
        $roles = Role::where('name', 'adm')->pluck('emp_id');
        $admins = User::select('emp_id','emp_name')
                        ->whereIn('emp_id', $roles)
                        ->get();

        //$adminsId = Role::select('emp_id')->where('name','adm')->get();
        //$users = User::select('emp_id','emp_name')->get();
        return $admins;
    }

    function addUserAdmin(Request $request){

        $role = new Role();
        $role->emp_id = $request->emp_id;
        $role->name = 'adm';
        $role->desc = 'admin';
        $role->save();
    }

    public function deleteUserAdmin($empId)
    {
        Role::where('emp_id',$empId)->delete();
    }

}
