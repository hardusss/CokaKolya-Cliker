"use strict";
$(document).ready(function () {
    let taskEneble = true; 
    let score = 5000; 
    let click_score = 1; 
    let energy = 1000; 
    let local = JSON.parse(localStorage.getItem('user')) || {}; 
    let MAX_ENERGY = 1000; 
    let ENERGY_RECHARGE_RATE = 3;
    let RECHARGE_INTERVAL = 3000;
    let forBoost = {
        '1k': 1000,
        '2k': 2000,
        '4k': 4000,
        '8k': 8000,
        '16k': 16000,
    };
    let priceAfterBoost = {
        '1k': '2k',
        '2k': '4k',
        '4k': '8k',
        '8k': '16k',
        '16k': 'Max boost',
    };
    let lvlAfterBoost = {
        ' 1 lvl': ' 2 lvl',
        ' 2 lvl': ' 3 lvl',
        ' 3 lvl': ' 4 lvl',
        ' 4 lvl': ' 5 lvl',
        ' 5 lvl': '',
    };
    try {
        let getScore = local.score || 5000;
        let getTaskEneble = local.task ?? true;
        let localLvl = local.lvl ?? [' 1 lvl'];
        let localPrice = local.price ?? '1k';

        let localLvlEnergy = local.lvlEnergy ;
        let localPriceEnergy = local.priceEnergy;
        let localMaxEnergy = local.max_energy ?? 1000;
    
        


        click_score = parseInt(localLvl[1]) || 1;
        if (localLvl == ''){
            click_score = 6
        }

        $('.boost-1 .boostprice').text(localPrice);
        $('.boost-1 .lvl').text(localLvl);
        $('.dialog-boost .boostprice').text(localPrice);
        $('.dialog-boost .lvl').text(localLvl);
        $('#getPoints').text(`+1 coin for tap for ${localLvl}`);

        $('.boost-2 .boostprice').text(localPriceEnergy);
        $('.boost-2 .lvl').text(localLvlEnergy);
        $('.dialog-boost-energy .boostprice').text(localPriceEnergy);
        $('.dialog-boost-energy .lvl').text(localLvlEnergy);
        $('.dialog-boost-energy #getPoints').text(`+500 energy points for ${localLvlEnergy}`);
        MAX_ENERGY = localMaxEnergy;
        $('#count-energy').text(`/${MAX_ENERGY}`);
        
        score = getScore;
        $('.score').text(formatNumber(score));
        $('.user-balance').text(formatNumber(score));
        taskEneble = getTaskEneble;

        if (taskEneble == false){
            $('.btn-join').addClass('active-join');
            $('#btn-join').removeClass('btn-join');
            $('#btn-join').html('<span class="material-symbols-outlined">check</span>');
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

            $('.add').remove();

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
            }, 400); 
            $('.add').on('click', function () {
                $(this).toggle();
            });
            click_on_second();
        }
    }

    function handleTouchEnd(e) {
        e.preventDefault(); 
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

                $('.add').remove();

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
                }, 200); 
                $('.add').on('click', function () {
                    $(this).toggle();
                });
                click_on_second();
            }
        }
    }

    let clickTimes = [];

       async function click_on_second (){
            const now = Date.now();
            clickTimes.push(now);

            // Видаляємо часи кліків старше однієї секунди
            clickTimes = clickTimes.filter(time => now - time <= 1000);

            if (clickTimes.length >= 4) {
                console.log("True");
                clickTimes = [];
            } else {
                
                console.log("False");
            }
        };
    $('#icon').on('click', handleClick);
    $('#icon').on('touchend', handleTouchEnd);


    $('.task').on('click', () => {
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

    $('.invite').on('click', () => {
        $('.box-referals').addClass('onselect');
        $('.invite path').css('fill', '#E50000')
        $('.box-referals p').css('color', '#E50000')
        

        $('.box-boost').removeClass('onselect');
        $('.list-boost path').css('fill', 'white')
        $('.box-boost p').css('color', 'white')

        $('.box-boost').removeClass('onselect');
        $('.list-boost path').css('fill', 'white')
        $('.box-boost p').css('color', 'white')
        
        $('.box-task').removeClass('onselect');
        $('.task path').css('fill', 'white')
        $('.box-task p').css('color', 'white')

        $('.conthome').removeClass('d-flex');
        $('.conthome').addClass('hide');
        $('.task-cont').css('display', 'none');
        $('.boost-cont').css('display', 'none');
        $('.referals').css('display', 'block');
    });

    $('.home').on('click', () => {
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

    $('.list-boost').on('click', () => {
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
            energy += 3;
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
        let forBoost = {
            '1k': 1000,
            '2k': 2000,
            '4k': 4000,
            '8k': 8000,
            '16k': 16000,
        };
        let priceboost = $('.boost-1 .boostprice').text();
        if ($('.boost-1 .lvl').text() != ' Max boost' && score >= forBoost[priceboost]){
            $('.dialog-boost').show();
            $('.overlay').addClass('overlay-on');
        }
    });

    $('.boost-2').on('click', () => {
        let forBoost = {
            '1k': 1000,
            '2k': 2000,
            '4k': 4000,
            '8k': 8000,
            '16k': 16000,
        };
        let priceboost = $('.boost-2 .boostprice').text();
        if ($('.boost-2 .lvl').text() != ' Max boost' && score >= forBoost[priceboost]){
            $('.dialog-boost-energy').show();
            $('.overlay').addClass('overlay-on');
        }
    });

    $('.btn-done').on('click', () => {
        $('.dialog-boost').hide();
        $('.overlay').removeClass('overlay-on');
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
        $('.dialog-boost-energy #getPoints').text(`+500 energy points for ${lvlAfterBoost[lvl]}`);
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

    $('.close-dialog').on('click', () => {
        $('.dialog-boost').hide();
        $('.dialog-boost-energy').hide();
        $('.overlay').removeClass('overlay-on');
    });

    function formatNumber(number) {
        let res =new Intl.NumberFormat('en-US').format(number);
        return res.replace(',', '.')
    }
});
