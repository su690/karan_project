import speech_recognition as sr
import pyttsx3

# Initialize the speech recognition and synthesis engines
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Questions and answers
questions = [
    {"question": "What is the chemical symbol for water?", "options": ["A) H2O", "B) CO2", "C) NaCl", "D) O2"], "answer": "A"},
    {"question": "What is the largest planet in our solar system?", "options": ["A) Earth", "B) Jupiter", "C) Saturn", "D) Mars"], "answer": "B"},
    {"question": "What is the powerhouse of the cell?", "options": ["A) Nucleus", "B) Mitochondrion", "C) Chloroplast", "D) Ribosome"], "answer": "B"},
    {"question": "Who wrote the play 'Romeo and Juliet'?", "options": ["A) William Shakespeare", "B) Charles Dickens", "C) Jane Austen", "D) Mark Twain"], "answer": "A"},
    {"question": "What is the capital of France?", "options": ["A) London", "B) Paris", "C) Berlin", "D) Rome"], "answer": "B"},
]

# Function to speak text
def speak(text):
    engine.say(text)
    engine.runAndWait()

# Function to get user's spoken response
def get_response():
    with sr.Microphone() as source:
        print("Speak your answer...")
        audio = recognizer.listen(source)
    try:
        response = recognizer.recognize_google(audio).upper()
        print(f"You said: {response}")
        return response
    except sr.UnknownValueError:
        speak("Sorry, I didn't catch that. Please try again.")
        return get_response()
    except sr.RequestError:
        speak("Sorry, there was an error processing your request.")
        return None

# Function to run the quiz
def run_quiz():
    score = 0
    for question in questions:
        speak(question["question"])
        for option in question["options"]:
            speak(option)
        response = get_response()
        if response == question["answer"]:
            speak("Correct!")
            score += 1
        else:
            speak(f"Wrong! The correct answer is {question['answer']}")
    speak(f"You scored {score} out of {len(questions)}")

# Main function to start the quiz
def main():
    speak("Welcome to the quiz!")
    run_quiz()
    speak("Thanks for playing!")

if __name__ == "__main__":
    main()
