spells = """
Body Possession	Swamp	D -9	d 2+
Spirit Possession	Lake	D -9	d 2+
Beastform	Lethe	D -10	d 10
Blindness	City	D -8	d 2+
Disease	Waste	D -11	d 5+
Deafness	Chasm	D -6	d 2+
Interdiction	Desert	D -7	d 7
Nightmare	Mountain	D -5	d 5
Task	Forest	D -8	d 8
Beastform Self	Forest	D -7	d 7
Fist of Thanatos	Plains	D -6	d 1+
Grotesque	Lethe	D -8	d 1+
Necromantic Fear	Lake	D -9	d 1+
Putrescence	Swamp	D -8	d 1+
Thanateye	Necropolis	D -5	d 1+
Animate Skeleton	Necropolis	D -9	d 1+
Animate Zombie	Necropolis	D -7	d 1+
Summon Despair	Waste	D -7	d 7
Summon Fear	Chasm	D -7	d 7
Summon Hate	Swamp	D -7	d 7
Speak with Dead	Desert	D -6	d 1+
Speak with Skull 	Bridge	D -4	d 1+
Claw of Thanatos*	Necropolis	D -8	d 8
Morbid Claw of Thanatos* 	Swamp	D -11	d 11
Murderblade**	G9	D -13	d 13
Detect Aura	Sanctuary	D -3	d 1
Read Aura	Sanctuary	D -3	d 3
"""

spells.split("\n").each do |spell|
    next if spell.strip.empty?

    spell =  spell.split '	'
    spell[2].sub! ' ', ''
    spell[3].sub! ' ', ''

    spell.each_index do |index|
        spell[index] = "'#{spell[index]}'"
    end

    spell = spell.join ','

    print "[#{spell}],\n"
end