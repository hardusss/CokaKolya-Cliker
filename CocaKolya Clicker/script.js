"use strict";
$(document).ready(function () {
    let taskEneble = true; 
    let score = 5000; 
    let click_score = 1; 
    let energy = 1000; 
    let local = JSON.parse(localStorage.getItem('user')) || {}; 
    let MAX_ENERGY = 1000; 
    let ENERGY_RECHARGE_RATE = 3;
    let RECHARGE_INTERVAL = 1900;
    let forBoost = {
        '1k': 1000,
        '2k': 2000,
        '4k': 4000,
        '8k': 8000,
        '16k': 16000,
        '32k': 32000,
        '64k': 64000,
        '128k': 128000,
        '256k': 256000,
        '512k': 512000
    };
    let priceAfterBoost = {
        '1k': '2k',
        '2k': '4k',
        '4k': '8k',
        '8k': '16k',
        '16k': '32k',
        '32k': '64k',
        '64k': '128k',
        '128k': '256k',
        '256k': '512k',
        '512k': 'Max boost'
    };
    let lvlAfterBoost = {
        ' 1lvl': ' 2lvl',
        ' 2lvl': ' 3lvl',
        ' 3lvl': ' 4lvl',
        ' 4lvl': ' 5lvl',
        ' 5lvl': ' 6lvl',
        ' 6lvl': ' 7lvl',
        ' 7lvl': ' 8lvl',
        ' 8lvl': ' 9lvl',
        ' 9lvl': ' 10lvl',
        ' 10lvl': ''
    };
    try {
        let getScore = local.score || 5000;
        let getTaskEneble = local.task ?? true;
        let localLvl = local.lvl ?? [' 1lvl'];
        let localPrice = local.price ?? '1k';

        let localLvlEnergy = local.lvlEnergy ?? [' 1lvl'] ;
        let localPriceEnergy = local.priceEnergy;
        let localMaxEnergy = local.max_energy ?? 1000;
        

        
        click_score = parseInt(localLvl[1]) || 1;
        if (localLvl == ''){
            click_score = 11
        }
        if (localLvl.includes('10')){
            click_score = 10
        }
        if (localMaxEnergy > 2000) {
            ENERGY_RECHARGE_RATE = 5;
            RECHARGE_INTERVAL = 1000;
        }
        $('.boost-1 .boostprice').text(localPrice);
        $('.boost-1 .lvl').text(localLvl);
        $('.dialog-boost .boostprice').text(localPrice);
        $('.dialog-boost .lvl').text(localLvl);
        $('#getPoints').text(`+1 банка за тап за ${localLvl}`);

        $('.boost-2 .boostprice').text(localPriceEnergy);
        $('.boost-2 .lvl').text(localLvlEnergy);
        $('.dialog-boost-energy .boostprice').text(localPriceEnergy);
        $('.dialog-boost-energy .lvl').text(localLvlEnergy);
        $('.dialog-boost-energy #getPoints').text(`+500 энергии за ${localLvlEnergy}`);
        MAX_ENERGY = localMaxEnergy;
        $('#count-energy').text(`/${MAX_ENERGY}`);
        
        score = getScore;
        $('.score').text(formatNumber(score));
        $('.user-balance').text(formatNumber(score));
        taskEneble = getTaskEneble;

        if (taskEneble == false){
            $('.btn-join').addClass('active-join');
            $('#btn-join').removeClass('btn-join');
            $('#btn-join').html('<svg width="50" height="50" style="margin-top: -5px" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '<rect x="1" y="1" width="38" height="38" fill="black" stroke="black" stroke-width="2"/>\n' +
                '<path d="M20 21H18V23H20V21Z" fill="white"/>\n' +
                '<path d="M14 15H12V17H14V15Z" fill="white"/>\n' +
                '<path d="M16 17H14V19H16V17Z" fill="white"/>\n' +
                '<path d="M18 19H16V21H18V19Z" fill="white"/>\n' +
                '<path d="M30 15H28V17H30V15Z" fill="white"/>\n' +
                '<path d="M30 13H28V15H30V13Z" fill="white"/>\n' +
                '<path d="M28 17H26V19H28V17Z" fill="white"/>\n' +
                '<path d="M28 15H26V17H28V15Z" fill="white"/>\n' +
                '<path d="M28 13H26V15H28V13Z" fill="white"/>\n' +
                '<path d="M26 19H24V21H26V19Z" fill="white"/>\n' +
                '<path d="M26 17H24V19H26V17Z" fill="white"/>\n' +
                '<path d="M26 15H24V17H26V15Z" fill="white"/>\n' +
                '<path d="M24 21H22V23H24V21Z" fill="white"/>\n' +
                '<path d="M24 19H22V21H24V19Z" fill="white"/>\n' +
                '<path d="M24 17H22V19H24V17Z" fill="white"/>\n' +
                '<path d="M22 23H20V25H22V23Z" fill="white"/>\n' +
                '<path d="M22 21H20V23H22V21Z" fill="white"/>\n' +
                '<path d="M22 19H20V21H22V19Z" fill="white"/>\n' +
                '<path d="M20 25H18V27H20V25Z" fill="white"/>\n' +
                '<path d="M20 23H18V25H20V23Z" fill="white"/>\n' +
                '<path d="M18 23H16V25H18V23Z" fill="white"/>\n' +
                '<path d="M18 21H16V23H18V21Z" fill="white"/>\n' +
                '<path d="M16 21H14V23H16V21Z" fill="white"/>\n' +
                '<path d="M16 19H14V21H16V19Z" fill="white"/>\n' +
                '<path d="M14 19H12V21H14V19Z" fill="white"/>\n' +
                '<path d="M14 17H12V19H14V17Z" fill="white"/>\n' +
                '<path d="M12 17H10V19H12V17Z" fill="white"/>\n' +
                '<path d="M12 15H10V17H12V15Z" fill="white"/>\n' +
                '</svg>\n');
        }
    } catch (error) {
        console.log('error', error);
    }

    function getCurrentTimeInSeconds() {
        return Math.floor(Date.now() / 1000);
    }

    function saveEnergyData(energy, lastInteractionTime) {
        local.energy = energy;
        local.lastInteractionTime = lastInteractionTime;
        localStorage.setItem('user', JSON.stringify(local));
    }

    function loadEnergyData() {
        let energy = local.energy ?? MAX_ENERGY;
        let lastInteractionTime = local.lastInteractionTime ?? getCurrentTimeInSeconds();
        return { energy, lastInteractionTime };
    }

    function rechargeEnergy(currentEnergy, lastInteractionTime) {
        const currentTime = getCurrentTimeInSeconds();
        const timeElapsed = currentTime - lastInteractionTime;
        const energyGained = Math.floor(timeElapsed / 3) * ENERGY_RECHARGE_RATE;
        return Math.min(currentEnergy + energyGained, MAX_ENERGY);
    }

    let { energy: savedEnergy, lastInteractionTime } = loadEnergyData();
    energy = rechargeEnergy(savedEnergy, lastInteractionTime);
    $('#user-energy').text(energy);
    let energy_progress = (energy / MAX_ENERGY) * 100;
    $('.progress-bar').css('width', energy_progress + '%');

    function handleClick(e) {
        e.preventDefault();
        $('#icon').removeClass('click-animation');
        if (energy > 0){
            score += click_score;
            local.score = score;
            local.task = taskEneble;
            saveEnergyData(energy, getCurrentTimeInSeconds());
            
            energy -= click_score;
            if (energy < 0){
                energy = 0;
            }
            $('#user-energy').text(energy);
            
            let energy_progress = (energy / MAX_ENERGY) * 100;
            $('.prb').attr('aria-valuenow', score);
            $('.progress-bar').css('width', energy_progress + '%');

            let posX = e.clientX;
            let posY = e.clientY;

            $('.score').text(formatNumber(score));
            $('.user-balance').text(formatNumber(score));

            $('.icon').append(`<div class="add">+${click_score}</div>`);

            $('.add').css({
                'position': 'absolute',
                'top': posY + 'px',
                'left': posX + 'px',
                'display': 'block'
            });

            $('#icon').addClass('click-animation');
            setTimeout(() => {
                $('#icon').removeClass('click-animation');
            }, 700); 
            
            click_on_second();
        }
    }

    function handleTouchEnd(e) {
        e.preventDefault(); 
        $('#icon').removeClass('click-animation');
        if (energy > 0){
            for (let i = 0; i < e.changedTouches.length; i++) {
                let touch = e.changedTouches[i];
                score += click_score;
                local.score = score;
                local.task = taskEneble;
                saveEnergyData(energy, getCurrentTimeInSeconds());

                energy -= click_score;
                if (energy < 0){
                    energy = 0;
                }
                $('#user-energy').text(energy);

                let energy_progress = (energy / MAX_ENERGY) * 100;
                $('.prb').attr('aria-valuenow', score);
                $('.progress-bar').css('width', energy_progress + '%');

                let posX = touch.clientX;
                let posY = touch.clientY;

                $('.score').text(formatNumber(score));
                $('.user-balance').text(formatNumber(score));


                let uniqueId = `add-${Date.now()}-${i}`;
                let addElement = $(`<div id="${uniqueId}" class="add">`).text(`+${click_score}`);
                $('.icon').append(addElement);

                $(`#${uniqueId}`).css({
                    'position': 'absolute',
                    'top': posY + 'px',
                    'left': posX + 'px',
                    'display': 'block'
                });

                $('#icon').addClass('click-animation');
                setTimeout(() => {
                    $('#icon').removeClass('click-animation');
                }, 300); 
               
                click_on_second();
            }
        }
    }

    let clickTimes = [];

       async function click_on_second (){
            const now = Date.now();
            clickTimes.push(now);

            // Видаляємо часи кліків старше однієї секунди
            clickTimes = clickTimes.filter(time => now - time <= 900);

            if (clickTimes.length >= 5) {
                const icons = document.querySelectorAll('.icone');
                const directions = [
                    { x: '0px', y: '-200px' },  
                    { x: '172px', y: '-100px' },
                    { x: '172px', y: '100px' }, 
                    { x: '0px', y: '200px' },    
                    { x: '-172px', y: '100px' }, 
                    { x: '-172px', y: '-100px' } 
                ];

                icons.forEach((icon, index) => {
                    icon.style.setProperty('--x', directions[index].x);
                    icon.style.setProperty('--y', directions[index].y);
                    icon.classList.remove('explode');
                    void icon.offsetWidth;
                    icon.classList.add('explode');
                });
                clickTimes = [];
            } else {
                
            }
        };

        
    $('#icon').on('click', handleClick);
    $('#icon').on('touchend', handleTouchEnd);


    $('.box-task').on('click', () => {
        $('.box-home').removeClass('onselect');
        $('.home path').css('fill', 'white')
        $('.box-home p').css('color', 'white')


        $('.box-task').addClass('onselect');
        $('.task path').css('fill', '#E50000')
        $('.box-task p').css('color', '#E50000')


        $('.box-boost').removeClass('onselect');
        $('.list-boost path').css('fill', 'white')
        $('.box-boost p').css('color', 'white')

        $('.box-referals').removeClass('onselect');
        $('.invite path').css('fill', 'white')
        $('.box-referals p').css('color', 'white')


        $('.conthome').removeClass('d-flex');
        $('.conthome').addClass('hide');
        $('.task-cont').css('display', 'block');
        $('.boost-cont').css('display', 'none');
        $('.referals').css('display', 'none');
    });

    $('.box-referals').on('click', () => {
        $('.box-referals').addClass('onselect');
        $('.invite path').css('fill', '#E50000')
        $('.box-referals p').css('color', '#E50000')
        

        $('.box-boost').removeClass('onselect');
        $('.list-boost path').css('fill', 'white')
        $('.box-boost p').css('color', 'white')

        $('.box-home').removeClass('onselect');
        $('.home path').css('fill', 'white')
        $('.box-home p').css('color', 'white')
        
        $('.box-task').removeClass('onselect');
        $('.task path').css('fill', 'white')
        $('.box-task p').css('color', 'white')

        $('.conthome').removeClass('d-flex');
        $('.conthome').addClass('hide');
        $('.task-cont').css('display', 'none');
        $('.boost-cont').css('display', 'none');
        $('.referals').css('display', 'block');
    });

    $('.box-home').on('click', () => {
        $('.add').remove()
        $('.containr').remove()
        setTimeout(() => {
            $('.animat').append('<div class="containr"><div class="icone" id="icon1"><img src="img/bottle.png" alt="Icon 1"></div><div class="icone" id="icon2"><img src="img/bottle.png" alt="Icon 2"></div><div class="icone" id="icon3"><img src="img/bottle.png" alt="Icon 3"></div><div class="icone" id="icon4"><img src="img/bottle.png" alt="Icon 4"></div><div class="icone" id="icon5"><img src="img/bottle.png" alt="Icon 5"></div><div class="icone" id="icon6"><img src="img/bottle.png" alt="Icon 6"></div></div>')
        }, 500); 
        $('.box-home').addClass('onselect');
        $('.home path').css('fill', '#E50000')
        $('.box-home p').css('color', '#E50000')

        $('.box-task').removeClass('onselect');
        $('.task path').css('fill', 'white')
        $('.box-task p').css('color', 'white')

        $('.box-boost').removeClass('onselect');
        $('.list-boost path').css('fill', 'white')
        $('.box-boost p').css('color', 'white')

        $('.box-referals').removeClass('onselect');
        $('.invite path').css('fill', 'white')
        $('.box-referals p').css('color', 'white')

        $('.conthome').addClass('d-flex');
        $('.conthome').removeClass('hide');
        $('.task-cont').css('display', 'none');
        $('.boost-cont').css('display', 'none');
        $('.referals').css('display', 'none');
    });

    $('.box-boost').on('click', () => {
        $('.box-boost').addClass('onselect');
        $('.list-boost path').css('fill', '#E50000')
        $('.box-boost p').css('color', '#E50000')


        $('.box-task').removeClass('onselect');
        $('.task path').css('fill', 'white')
        $('.box-task p').css('color', 'white')

        
        $('.box-home').removeClass('onselect');
        $('.home path').css('fill', 'white')
        $('.box-home p').css('color', 'white')

        $('.box-referals').removeClass('onselect');
        $('.invite path').css('fill', 'white')
        $('.box-referals p').css('color', 'white')


        $('.conthome').removeClass('d-flex');
        $('.conthome').addClass('hide');
        $('.task-cont').css('display', 'none');
        $('.boost-cont').css('display', 'flex');
        $('.referals').css('display', 'none');
    });

    const regenerationEnergy = setInterval(() => {
        if (energy < MAX_ENERGY) {
            energy += ENERGY_RECHARGE_RATE;
            if (energy > MAX_ENERGY){
                energy = MAX_ENERGY;
            }
            let energy_progress = (energy / MAX_ENERGY) * 100;
            $('.progress-bar').css('width', energy_progress + '%');
            $('#user-energy').text(energy);
            saveEnergyData(energy, getCurrentTimeInSeconds());
        }
    }, RECHARGE_INTERVAL);

    $('.btn-join').on('click', () => {
        if (taskEneble == true){
            window.location.href = 'https://t.me/cocakolyaonton';
            score += 100000;
            $('.score').text(formatNumber(score));
            taskEneble = false;
            local.task = taskEneble;
            local.score = score;
            localStorage.setItem('user', JSON.stringify(local));
            $('.btn-join').addClass('active-join');
            $('#btn-join').removeClass('btn-join');
            setTimeout(() => {
                $('#btn-join').html('<span class="material-symbols-outlined">check</span>');
            }, 500);
        }
    });

    $('.boost-1').on('click', () => {
        $('.cont-error').remove()
        let forBoost = {
            '1k': 1000,
            '2k': 2000,
            '4k': 4000,
            '8k': 8000,
            '16k': 16000,
            '32k': 32000,
            '64k': 64000,
            '128k': 128000,
            '256k': 256000,
            '512k': 512000
        };
        let priceboost = $('.boost-1 .boostprice').text();
        if (score >= forBoost[priceboost]){
            $('.dialog-boost').show();
            $('.overlay').addClass('overlay-on');
        } else {
            console.log('l');
            if(priceboost == 'Max boost'){
                showPopUp('Макс LVL');
            }else {
                showPopUp('Мало банок')
            }
        }
    });

    $('.boost-2').on('click', () => {
        $('.cont-error').remove()
        let forBoost = {
            '1k': 1000,
            '2k': 2000,
            '4k': 4000,
            '8k': 8000,
            '16k': 16000,
            '32k': 32000,
            '64k': 64000,
            '128k': 128000,
            '256k': 256000,
            '512k': 512000
        };
        let priceboost = $('.boost-2 .boostprice').text();
        if (score >= forBoost[priceboost]) {
          if (priceboost != 'Max boost') {
            $('.dialog-boost-energy').show();
            $('.overlay').addClass('overlay-on');
          }
        } else {
            if (priceboost == 'Max boost') {
                showPopUp('Макс LVL');
        } else {
            showPopUp('Мало банок')
        }
    }
    });

    $('.btn-done').on('click', () => {
        $('.dialog-boost').hide();
        $('.overlay').removeClass('overlay-on');
        showPopUp('Новый lvl')
        let priceboost = $('.boost-1 .boostprice').text();
        let lvl = $('.boost-1 .lvl').text();
        if (score >= forBoost[priceboost]){
            score -= forBoost[priceboost]
            $('.score').text(formatNumber(score));
            $('.user-balance').text(formatNumber(score));
            click_score++;
            $('.boost-1 .boostprice').text(priceAfterBoost[priceboost]);
            $('.boost-1 .lvl').text(lvlAfterBoost[lvl]);
            $('.dialog-boost .boostprice').text(priceAfterBoost[priceboost]);
            $('.dialog-boost .lvl').text(lvlAfterBoost[lvl]);
            $('#getPoints').text(`+1 coin for tap for ${lvlAfterBoost[lvl]}`);
            local.lvl = lvlAfterBoost[lvl];
            local.score = score
            local.price = priceAfterBoost[priceboost];
            localStorage.setItem('user', JSON.stringify(local));
        } 

    });
    $('.btn-done-energy').on('click', () => {
        $('.dialog-boost-energy').hide();
        $('.overlay').removeClass('overlay-on');
        showPopUp('Новый lvl')
        let priceboost = $('.boost-2 .boostprice').text();
        let lvl = $('.boost-2 .lvl').text();
        score -= forBoost[priceboost];
        $('.score').text(formatNumber(score));
        $('.user-balance').text(formatNumber(score));
        MAX_ENERGY += 500;
        $('#count-energy').text(`/${MAX_ENERGY}`);
        $('.boost-2 .boostprice').text(priceAfterBoost[priceboost]);
        $('.boost-2 .lvl').text(lvlAfterBoost[lvl]);
        $('.dialog-boost-energy .boostprice').text(priceAfterBoost[priceboost]);
        $('.dialog-boost-energy .lvl').text(lvlAfterBoost[lvl]);
        $('.dialog-boost-energy #getPoints').text(`+1 банка за тап за${lvlAfterBoost[lvl]}`);
        local.lvlEnergy = lvlAfterBoost[lvl];
        local.priceEnergy = priceAfterBoost[priceboost];
        local.score = score
        local.max_energy = MAX_ENERGY
        localStorage.setItem('user', JSON.stringify(local));
    });

    $('.overlay').on('click', () => {
        $('.dialog-boost').hide();
        $('.dialog-boost-energy').hide();
        $('.overlay').removeClass('overlay-on');
    });

    function formatNumber(number) {
        let res =new Intl.NumberFormat('en-US').format(number);
        return res.replace(',', '.')
    }

    function showPopUp(message) {
        let errorDiv = $('<div class="cont-error">' + message + '</div>');
        $('body').append(errorDiv);
        errorDiv.fadeIn().delay(3000).fadeOut(function() {
          $(this).remove();
        });
      }
});
