describe('application loading', () => {
  describe('click events', () => {
    describe('when the make larger button is clicked', () => {
      it('opens new window', async () => {
        const originalWindowHandle = await browser.getWindowHandle();

        const openWindowButton = await browser.$('.open-window');
        await openWindowButton.click();

        // Wait for the new window to open
        await browser.waitUntil(
          async () => {
            const windowHandles = await browser.getWindowHandles();
            return windowHandles.length > 1;
          },
          { timeout: 5000, timeoutMsg: 'New window did not open within 5 seconds' },
        );

        // Switch to the new window
        const windowHandles = await browser.getWindowHandles();
        const newWindowHandle = windowHandles.find((handle) => handle !== originalWindowHandle);
        await browser.switchToWindow(newWindowHandle);

        // Check if the <h1> element exists in the new window
        const h1Element = await browser.$('h1');
        await h1Element.waitForExist({ timeout: 5000 });
        expect(await h1Element.getText()).toBe('New Window Content');

        // Switch back to the original window
        await browser.switchToWindow(originalWindowHandle);
      });
    });
  });
});
