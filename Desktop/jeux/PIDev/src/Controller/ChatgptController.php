<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use OpenAI\API\Request\ApiException;
use OpenAI\Exceptions\ErrorException; // Import the ErrorException class
use OpenAI;

class ChatgptController extends AbstractController
{
    #[Route('/chatgpt', name: 'app_chatgpt')]
    public function index(): Response
    {
        return $this->render('chatgpt/index.html.twig', [
            'controller_name' => 'ChatgptController',
        ]);
    }

    #[Route('/aa', name: 'app_aa')]
    public function indexx(?string $question, ?string $response): Response
    {
        return $this->render('chatgpt/index.html.twig', [
            'question' => $question,
            'response' => $response
        ]);
    }

    #[Route('/chat', name: 'send_chat', methods:"POST")]
    public function chat(Request $request): Response
    {
        $question = $request->request->get('text');

        try {
            // Implement chat GPT
            $myApiKey = $_ENV['OPENAI_KEY'];
            $client = OpenAI::client($myApiKey);
            $result = $client->completions()->create([
                'model' => 'gpt-3.5-turbo-instruct',
                'prompt' => $question,
                'max_tokens' => 2048
            ]);
            $response = $result->choices[0]->text;
        } catch (ErrorException $e) { // Catch ErrorException specifically
            // Handle API error due to quota exceeded
            $errorMessage = 'You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors';
            return new Response($errorMessage, Response::HTTP_TOO_MANY_REQUESTS);
        } catch (ApiException $e) {
            // Handle other API exceptions
            $errorMessage = 'An error occurred while processing your request.';
            return new Response($errorMessage, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->forward('App\Controller\ChatgptController::index', [
            'question' => $question,
            'response' => $response
        ]);
    }
}
