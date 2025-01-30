from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import os
from dotenv import load_dotenv

dotenv_path = '../../.env'
load_dotenv(dotenv_path)

email = os.getenv('TEST_EMAIL')
password = os.getenv('TEST_PASSWORD')

def test_search_term(driver, search_term):
    try:
        search_box = WebDriverWait(driver, 20).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))
        )
        search_box.send_keys(search_term)
        search_box.send_keys(Keys.RETURN)
        print(f"Search term '{search_term}' entered and search triggered.")

        WebDriverWait(driver, 30).until(
            lambda x: x.find_elements(By.CSS_SELECTOR, ".album-item") or 
                      x.find_elements(By.CSS_SELECTOR, ".no-results-message")
        )

        results = driver.find_elements(By.CSS_SELECTOR, ".album-item")
        if results:
            print(f"Found {len(results)} search results for '{search_term}'.")
            return "Test passed: Results found."
        else:
            print(f"No search results found for '{search_term}', as expected.")
            return "Test passed: No results found."

    except Exception as e:
        print(f"Error while searching for '{search_term}': {e}")
        return "Test failed: Term does not exist."

# Configure Chrome options for headless mode
options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

# Setup service with ChromeDriverManager for automatic driver installation
service = Service(ChromeDriverManager().install())

driver = None

try:
    # Initialize the driver
    driver = webdriver.Chrome(service=service, options=options)
    
    driver.get("http://localhost:3000/login")
    
    email_input = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
    )
    email_input.send_keys(email)
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h1"))
    )

    print("Login successful and home page loaded.")

    driver.find_element(By.LINK_TEXT, "Albums").click()

    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))
    )

    print("Albums page loaded.")

    # Test with an existing term
    print(test_search_term(driver, "qui"))  
    
    # Clear the search box before the next test
    search_box = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))
    )
    search_box.clear()

    # Test with a non-existent term
    print(test_search_term(driver, "flo"))  

except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    if driver:
        driver.quit()