from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

try:
    driver.get("http://localhost:3000/login")
    
    email_input = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
    )
    email_input.send_keys("florencenyokabiwangui@gmail.com")

    password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
    password_input.send_keys("popcorn365")

    login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    login_button.click()

    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h1"))
    )

    print("Login successful and home page loaded.")

    albums_link = driver.find_element(By.LINK_TEXT, "Albums")
    albums_link.click()

    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))
    )

    print("Albums page loaded.")

    search_box = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))
    )
    search_box.send_keys("flo")
    search_box.send_keys(Keys.RETURN)

    print("Search term entered and search triggered.")

    try:
        print("Waiting for search results...")
        WebDriverWait(driver, 30).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".album-item"))
        )
        print("Search results should be loaded.")
    except Exception as e:
        print("Error waiting for search results:")
        print(f"Exception: {e}")
        raise

    print("Search results loaded. Verifying results.")

    results = driver.execute_script('return document.querySelectorAll(".album-item")')
    
    if len(results) == 0:
        print("No search results found.")
        raise Exception("Search results are not found, check the page structure or search functionality.")

    print(f"Found {len(results)} search results.")
    
    assert len(results) > 0

    print("Test passed. Search results found.")

finally:
    driver.quit()