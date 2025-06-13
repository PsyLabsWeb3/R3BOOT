<?php

namespace App\Http\Controllers;

use App\Models\ConversationMessage;
use App\Models\User;
use App\Models\UserWallets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
            ]);

            // Create the user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token
            ], 201);
        } catch (\Throwable $th) {
            // Handle any exceptions that occur
            return response()->json(['error' => 'Registration failed', 'message' => $th->getMessage()], 500);
        }
    }

    public function getAuthUser()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            $conversation_messages = ConversationMessage::where('user_id', $user->uuid)->orderBy('created_at', 'asc')->select('type', 'message')->get();
            $wallet = UserWallets::where('user_uuid', $user->uuid)->first();

            $user_data = [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'messages' => $conversation_messages,
                'wallet' => $wallet ? $wallet->wallet_address : null,
            ];

            return response()->json($user_data, 200);
        } catch (\Throwable $th) {
            // Handle any exceptions that occur
            return response()->json(['error' => 'Failed to retrieve authenticated user', 'message' => $th->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $user = $request->user();
                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'message' => 'Login successful',
                    'user' => $user,
                    'token' => $token
                ], 200);
            } else {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (\Throwable $th) {
            // Handle any exceptions that occur
            return response()->json(['error' => 'Login failed', 'message' => $th->getMessage()], 500);
        }
    }

    public function receiveMessage(Request $request)
    {
        $new_message_in = new ConversationMessage();
        $new_message_in->user_id = Auth::user()->uuid;
        $new_message_in->type = '1'; // 0= Assistant, 1= User
        $new_message_in->message = $request->message;
        $new_message_in->save();

        //Send message to the bot and receive the response
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => 'http://localhost:3000/f1c7e9ed-343e-07b1-8288-8b4160e09c28/message',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'text' => $request->message,
                'user' => Auth::user()->uuid,
            ]),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                // 'Authorization: Bearer YOUR_API_KEY', // Descomenta si necesitas autenticación
            ],
        ]);

        $bot_response = curl_exec($curl);

        curl_close($curl);

        $response_json = json_decode($bot_response, true);

        $message = '';

        foreach ($response_json as $response) {
            $message .= $response['text'] . '  ';
        }

        $new_message_out = new ConversationMessage();
        $new_message_out->user_id = Auth::user()->uuid;
        $new_message_out->type = '0'; // 0= Assistant, 1= User
        $new_message_out->message = $message;
        $new_message_out->save();

        return response()->json([
            'message' => 'Message received and processed successfully',
            'response' => $message
        ], 200);
    }

    public function editWallet(Request $request)
    {
        try {
            $request->validate([
                'wallet' => 'required|string|max:255',
            ]);

            $wallet_val = UserWallets::where('user_uuid', Auth::user()->uuid)->first();
            if ($wallet_val) {
                $wallet_val->wallet_address = $request->wallet;
                $wallet_val->save();
            } else {
                UserWallets::create([
                    'user_uuid' => Auth::user()->uuid,
                    'wallet_address' => $request->wallet,
                ]);
            }
            return response()->json([
                'message' => 'Wallet updated successfully',
                'wallet' => $request->wallet
            ], 200);
        } catch (\Throwable $th) {
            // Handle any exceptions that occur
            return response()->json(['error' => 'Failed to update wallet', 'message' => $th->getMessage()], 500);
        }
    }

    public function getWalletBalance()
    {
        $wallet = UserWallets::where('user_uuid', Auth::user()->uuid)->first();

        $curl = curl_init();

        $message = 'Whenever I tell you to go fetch balances, go ahead and do it no matter if youve fetched them before:' . $wallet->wallet_address;

        curl_setopt_array($curl, [
            CURLOPT_URL => 'http://localhost:3000/f1c7e9ed-343e-07b1-8288-8b4160e09c28/message',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'text' => $message,
                'user' => Auth::user()->uuid,
            ]),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                // 'Authorization: Bearer YOUR_API_KEY', // Descomenta si necesitas autenticación
            ],
        ]);

        $bot_response = curl_exec($curl);
        curl_close($curl);
        $response_json = json_decode($bot_response, true);

        if (isset($response_json[1]['text'])) {
            return response()->json(['balance' => $response_json[1]['text']], 200);
        } else {
            return response()->json(['error' => 'Balance information not found'], 404);
        }

        return $response_json;
    }


    public function getWalletMovements()
    {
        $wallet = UserWallets::where('user_uuid', Auth::user()->uuid)->first();

        $curl = curl_init();

        $message = 'Fetch the lastest transactions for this wallet:' . $wallet->wallet_address;

        curl_setopt_array($curl, [
            CURLOPT_URL => 'http://localhost:3000/f1c7e9ed-343e-07b1-8288-8b4160e09c28/message',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'text' => $message,
                'user' => Auth::user()->uuid,
            ]),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                // 'Authorization: Bearer YOUR_API_KEY', // Descomenta si necesitas autenticación
            ],
        ]);

        $bot_response = curl_exec($curl);
        curl_close($curl);
        $response_json = json_decode($bot_response, true);

        if (isset($response_json[1]['text'])) {
            return response()->json(['balance' => $response_json[1]['text']], 200);
        } else {
            return response()->json(['error' => 'Balance information not found'], 404);
        }

        return $response_json;
    }
}
