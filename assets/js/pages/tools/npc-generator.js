/*
 *
 */
function generateHumanoidNPCCard(character, uid, ignore_icons = false) {
    var div = $('.humanoids-cards');
    var build = character['build'].replace(' ', '');

    var html = '';
    html += '<div class="npc-card col-md-auto" id="npc-'+uid+'">'
    html += '<table>'
    html += '<tr><td class="build" COLSPAN=3>'
    html += build

    if(!ignore_icons) {
        html += ' <a><i class="ra ra-sword" onclick="javascript:download('+uid+')"></i>'
        html += ' <i class="ra ra-double-team" onclick="javascript:generateBuild(\''+build+'\')"></i>'
    }
    
    html += '</a></td></tr>'
    html += '<tr><td>Height</td><td>:</td><td class="value">'+character['characteristics']['height']+'</td></tr>'
    html += '<tr><td>Life</td><td>:</td><td class="value">'+character['characteristics']['life']+'</td></tr>'
    html += '<tr><td>Encurance</td><td>:</td><td class="value">'+character['characteristics']['endurance']+'</td></tr>'
    html += '<tr><td>Dream</td><td>:</td><td class="value">'+character['characteristics']['dream']+'</td></tr>'
    html += '<tr><td>Melee</td><td>:</td><td class="value">'+character['characteristics']['melee']+'</td></tr>'
    html += '<tr><td>Missile</td><td>:</td><td class="value">'+character['characteristics']['missile']+'</td></tr>'
    html += '<tr><td>Throw</td><td>:</td><td class="value">'+character['characteristics']['throw']+'</td></tr>'
    html += '<tr><td>DM</td><td>:</td><td class="value">'+character['characteristics']['damage-modifier']+'</td></tr>'
    
    var keys = Object.keys(character["resolutions"]);
    keys = RDDJS.utils.shuffleArray(keys);
    var max = (keys.length >= 4) ? 4 : keys.length;
    var j = 0;

    for(var i = 0; i < max; i++) {
        j++;

        // we add a contingency in case something goes wrong ;)
        if(j > 10) {
            break;
        }

        key = keys[i];

        // just in case!
        if(!key) {
            break;
        }

        value = character["resolutions"][key];

        // We don't bother displaying skills that are -X
        if(value.indexOf('--') != -1) {
            if(i > 0) {
                i--;
            }
            continue;
        }

        key = key.replace('-', ' ')
        html += '<tr><td class="text-capitalize">'+key+'</td><td>:</td><td class="value">'+value+'</td></tr>'
    }
    
    html += '</table>'
    html += '</div>'

    div.append(html);
}