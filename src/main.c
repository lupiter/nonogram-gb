#include <gb/gb.h>
#include <stdint.h>
#include <gbdk/platform.h>
#include <gb/drawing.h>

#include "title.h"
#include "menu.h"

void main(void)
{
	title_loop();

    menu_loop();

    // Loop forever
    while(1) {


		// Game main loop processing goes here


		// Done processing, yield CPU and wait for start of next frame
        vsync();
    }
}
