from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time

options = webdriver.ChromeOptions()
options.add_argument('--headless')  
options.add_argument('--disable-gpu')  
options.add_argument('--no-sandbox')  
options.add_argument('--disable-dev-shm-usage') 
options.add_argument('--remote-debugging-port=9222')  
options.add_argument('--disable-extensions')  
options.add_argument('--disable-infobars')  
options.add_argument('--window-size=1920x1080') 

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    
    driver.get('http://your-photo-album-url.com') 

   
    search_box = driver.find_element(By.NAME, 'search') 
    search_term = ''  
    search_box.send_keys(search_term)
    search_box.submit() 

    
    time.sleep(3) 

   
    results = driver.find_elements(By.CLASS_NAME, 'result-item') 
    assert len(results) > 0, "No results found"
    print("Test passed: Results found.")

finally:
    
    driver.quit()
